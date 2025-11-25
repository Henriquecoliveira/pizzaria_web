import { Router } from "express";
import { getPool } from "../db_pizzaria.js";
import sql from "mssql";
const router = Router();
// ================================
// CADASTRAR CLIENTE
// ================================
router.post("/cadastrar", async (req, res) => {
    try {
        const { email, usuario, senha, cpf, telefone } = req.body;
        // ----- validações simples -----
        if (!email || !usuario || !senha || !cpf || !telefone) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Todos os campos são obrigatórios.",
            });
        }
        const pool = await getPool();
        // ----- verifica se email já existe -----
        const emailCheck = await pool
            .request()
            .input("email", sql.VarChar, email)
            .query("SELECT EMAIL FROM CLIENTES WHERE EMAIL = @email");
        if (emailCheck.recordset.length > 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "E-mail já cadastrado.",
            });
        }
        // ----- INSERT -----
        await pool
            .request()
            .input("EMAIL", sql.VarChar(50), email)
            .input("USUARIO", sql.VarChar(100), usuario)
            .input("SENHA", sql.VarChar(30), senha)
            .input("CPF", sql.VarChar(11), cpf)
            .input("TELEFONE", sql.VarChar(15), telefone)
            .input("USER_LEVEL", sql.VarChar(1), "1")
            .query(`
    INSERT INTO CLIENTES (EMAIL, USUARIO, SENHA, CPF, TELEFONE, USER_LEVEL)
    VALUES (@EMAIL, @USUARIO, @SENHA, @CPF, @TELEFONE, @USER_LEVEL)
  `);
        return res.json({
            sucesso: true,
            mensagem: "Cliente cadastrado com sucesso!",
        });
    }
    catch (erro) {
        console.error("❌ Erro ao cadastrar cliente:", erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro no servidor ao cadastrar cliente.",
        });
    }
});
export default router;
