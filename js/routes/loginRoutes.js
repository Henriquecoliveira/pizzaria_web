import { Router } from "express";
import { getPool } from "../db_pizzaria.js";
import sql from "mssql";
const router = Router();
// ===== ROTA DE LOGIN =====
router.post("/", async (req, res) => {
    console.log("➡️ Body recebido:", req.body);
    const { login, senha } = req.body;
    if (!login || !senha) {
        return res.status(400).json({ error: "Credenciais incompletas." });
    }
    try {
        const pool = await getPool();
        const result = await pool
            .request()
            .input("login", sql.VarChar, login)
            .input("senha", sql.VarChar, senha)
            .query(`
        SELECT USUARIO_ID, EMAIL, USUARIO, USER_LEVEL
        FROM CLIENTES
        WHERE (EMAIL = @login OR USUARIO = @login)
        AND SENHA = @senha
      `);
        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Usuário ou senha inválidos." });
        }
        return res.json({
            sucesso: true,
            dados: result.recordset[0],
        });
    }
    catch (error) {
        console.error("❌ Erro no login:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
});
export default router;
