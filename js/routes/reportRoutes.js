import express from "express";
import sql from "mssql";
import { getPool } from "../db_pizzaria.js";
const router = express.Router();
/* ============================================================
   RELATÓRIO DO DIA (data atual)
   ============================================================ */
router.get("/dia", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                P.PEDIDO_ID,
                P.USUARIO_ID,
                P.DATA_HORA_PEDIDO,
                P.ENDERECO,
                P.FORMA_DE_PAGAMENTO,
                I.ALIMENTO,
                I.PRECO,
                SUM(I.PRECO) OVER (PARTITION BY P.PEDIDO_ID) AS TOTAL_DO_PEDIDO
            FROM PEDIDO P
            INNER JOIN PEDIDO_ITENS I ON I.PEDIDO_ID = P.PEDIDO_ID
            WHERE CONVERT(date, P.DATA_HORA_PEDIDO) = CONVERT(date, GETDATE())
            ORDER BY P.PEDIDO_ID DESC
        `);
        res.json(result.recordset);
    }
    catch (err) {
        console.error("Erro no relatório do dia:", err);
        res.status(500).json({ error: "Erro ao buscar relatório do dia" });
    }
});
/* ============================================================
   RELATÓRIO DO MÊS (mês escolhido)
   ============================================================ */
router.get("/mes/:mes", async (req, res) => {
    const mes = Number(req.params.mes);
    if (mes < 1 || mes > 12) {
        return res.status(400).json({ error: "Mês inválido" });
    }
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input("mes", sql.Int, mes)
            .query(`
                SELECT 
                    P.PEDIDO_ID,
                    P.USUARIO_ID,
                    P.DATA_HORA_PEDIDO,
                    P.ENDERECO,
                    P.FORMA_DE_PAGAMENTO,
                    I.ALIMENTO,
                    I.PRECO,
                    SUM(I.PRECO) OVER (PARTITION BY P.PEDIDO_ID) AS TOTAL_DO_PEDIDO
                FROM PEDIDO P
                INNER JOIN PEDIDO_ITENS I ON I.PEDIDO_ID = P.PEDIDO_ID
                WHERE MONTH(P.DATA_HORA_PEDIDO) = @mes
                ORDER BY P.PEDIDO_ID DESC
            `);
        res.json(result.recordset);
    }
    catch (err) {
        console.error("Erro no relatório do mês:", err);
        res.status(500).json({ error: "Erro ao buscar relatório do mês" });
    }
});
export default router;
