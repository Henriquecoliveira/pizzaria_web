// ts/routes/pedidoRoutes.ts
// (substitua TODO o conteúdo atual por este)

import express from "express";
import sql from "mssql";
import { getPool } from "../db_pizzaria.js";

const router = express.Router();

/*
  ===========================================
  ============== FINALIZAR PEDIDO ===========
  ===========================================
*/
router.post("/finalizar", async (req, res) => {
  console.log("POST /pedido/finalizar - body:", JSON.stringify(req.body));

  try {
    const { usuarioId, formaPagamento, endereco, itens } = req.body ?? {};

    // ================= VALIDAÇÕES =================
    if (!usuarioId)
      return res.status(400).json({ sucesso: false, mensagem: "usuarioId é obrigatório." });

    if (!formaPagamento)
      return res.status(400).json({ sucesso: false, mensagem: "formaPagamento é obrigatório." });

    if (!itens || !Array.isArray(itens) || itens.length === 0)
      return res.status(400).json({
        sucesso: false,
        mensagem: "itens é obrigatório e deve conter pelo menos 1 item."
      });

    // Normaliza/valida itens
    const itensValidos = [];
    for (const it of itens) {
      const id = Number(it.id);           // <-- ID da pizza
      const quantidade = Number(it.quantidade);
      const preco = Number(it.preco);

      if (!id || quantidade <= 0 || Number.isNaN(preco)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Item inválido no array 'itens': " + JSON.stringify(it)
        });
      }

      itensValidos.push({ id, quantidade, preco });
    }

    // ================= CONEXÃO =================
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // ===========================================================
      // 1) INSERIR PEDIDO (compatível com SEU BANCO)
      // ===========================================================

      const reqPedido = new sql.Request(transaction);

      reqPedido.input("USUARIO_ID", sql.Int, usuarioId);
      reqPedido.input("FORMA_DE_PAGAMENTO", sql.VarChar(30), formaPagamento);
      reqPedido.input("ENDERECO", sql.VarChar(255), endereco ?? "");

      // Só existem estas colunas:
      // PEDIDO_ID, USUARIO_ID, DATA_HORA_PEDIDO, FORMA_DE_PAGAMENTO, ENDERECO
      const insertPedidoSql = `
        INSERT INTO PEDIDO (USUARIO_ID, FORMA_DE_PAGAMENTO, ENDERECO)
        OUTPUT INSERTED.PEDIDO_ID
        VALUES (@USUARIO_ID, @FORMA_DE_PAGAMENTO, @ENDERECO)
      `;

      const resultPedido = await reqPedido.query(insertPedidoSql);

      const pedidoId = resultPedido?.recordset?.[0]?.PEDIDO_ID;

      if (!pedidoId)
        throw new Error("Não foi possível obter PEDIDO_ID após o INSERT.");

      // ===========================================================
      // 2) INSERIR ITENS DO PEDIDO (compatível com SEU BANCO)
      // ===========================================================
      // Tabela PEDIDO_ITENS possui:
      // ITEM_ID, PEDIDO_ID, ALIMENTO, PRECO

      for (const item of itensValidos) {
        const reqItem = new sql.Request(transaction);

        reqItem.input("PEDIDO_ID", sql.Int, pedidoId);

        // Aqui buscamos o nome da pizza pela PIZZA_ID
        // porque no seu banco PEDIDO_ITENS usa "ALIMENTO"
        const pizza = await pool
          .request()
          .input("ID", sql.Int, item.id)
          .query("SELECT PIZZA FROM PIZZA WHERE PIZZA_ID = @ID");

        const nomePizza = pizza.recordset?.[0]?.PIZZA;

        if (!nomePizza)
          throw new Error(`PIZZA não encontrada para ID=${item.id}`);

        reqItem.input("ALIMENTO", sql.VarChar(40), nomePizza);
        reqItem.input("PRECO", sql.Decimal(10, 2), item.preco * item.quantidade);

        const insertItemSql = `
          INSERT INTO PEDIDO_ITENS (PEDIDO_ID, ALIMENTO, PRECO)
          VALUES (@PEDIDO_ID, @ALIMENTO, @PRECO)
        `;

        await reqItem.query(insertItemSql);
      }

      // Finaliza transação
      await transaction.commit();

      return res.json({
        sucesso: true,
        mensagem: "Pedido salvo com sucesso!",
        pedidoId
      });

    } catch (innerErr) {
      console.error("Erro dentro da transação:", innerErr);
      await transaction.rollback();
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao salvar pedido (transação).",
        erro: String(innerErr)
      });
    }

  } catch (erro) {
    console.error("Erro ao finalizar pedido (externo):", erro);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao salvar o pedido.",
      erro: String(erro)
    });
  }
});

export default router;
