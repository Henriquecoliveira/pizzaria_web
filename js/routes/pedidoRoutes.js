// ts/routes/pedidoRoutes.ts
import { Router } from "express";
import sql from "mssql";
import { getPool } from "../db_pizzaria.js";
const router = Router();
/**
 * Body esperado:
 * {
 *   usuarioId: number,
 *   formaPagamento: string,
 *   endereco: string,
 *   itens: [
 *     { alimento: string, preco: number },
 *     ...
 *   ]
 * }
 */
router.post("/finalizar", async (req, res) => {
    const { usuarioId, formaPagamento, endereco, itens } = req.body;
    if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
    }
    if (!formaPagamento || !endereco || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Dados do pedido incompletos." });
    }
    let pool;
    try {
        pool = await getPool();
    }
    catch (err) {
        console.error("Erro ao obter pool:", err);
        return res.status(500).json({ error: "Erro de conexão com o banco." });
    }
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        // Inserir PEDIDO e retornar PEDIDO_ID usando OUTPUT INSERTED.PEDIDO_ID
        const reqInsert = new sql.Request(transaction);
        reqInsert.input("usuarioId", sql.Int, usuarioId);
        reqInsert.input("forma", sql.VarChar(30), formaPagamento);
        reqInsert.input("endereco", sql.VarChar(255), endereco);
        const insertPedidoQuery = `
      INSERT INTO PEDIDO (USUARIO_ID, FORMA_DE_PAGAMENTO, ENDERECO)
      OUTPUT INSERTED.PEDIDO_ID
      VALUES (@usuarioId, @forma, @endereco)
    `;
        const pedidoResult = await reqInsert.query(insertPedidoQuery);
        const pedidoId = pedidoResult.recordset?.[0]?.PEDIDO_ID;
        if (!pedidoId)
            throw new Error("Não foi possível recuperar o ID do pedido.");
        // Inserir os itens
        for (const item of itens) {
            const r = new sql.Request(transaction);
            r.input("pedidoId", sql.Int, pedidoId);
            r.input("alimento", sql.VarChar(40), item.alimento);
            // PRECO definido DECIMAL(10,2) no schema
            r.input("preco", sql.Decimal(10, 2), item.preco);
            await r.query(`INSERT INTO PEDIDO_ITENS (PEDIDO_ID, ALIMENTO, PRECO)
         VALUES (@pedidoId, @alimento, @preco)`);
        }
        await transaction.commit();
        return res.json({ sucesso: true, pedidoId });
    }
    catch (err) {
        console.error("Erro ao finalizar pedido:", err);
        try {
            await transaction.rollback();
        }
        catch (rbErr) {
            console.error("Erro ao rollback:", rbErr);
        }
        return res.status(500).json({ error: "Erro ao salvar pedido." });
    }
});
export default router;
