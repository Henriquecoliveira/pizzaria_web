// imports externos
import { Router } from "express"; // cria um agrupador de rotas (mini servidor)
import multer from "multer"; // vai receber arquivos enviados via formulário (ex: imagens)
import path from "path"; // lida com caminhos de arquivos
import fs from "fs"; // permite ler, criar e editar arquivos e pastas no sistema

// imports locais
import { getPool } from "../db_pizzaria.js"; // função que retorna a pool de conexão com SQL Server

// cria o objeto para gerenciar as rotas
const router = Router();


// ========== GARANTE QUE EXISTE A PASTA uploads/ ==========
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads"); // se a pasta não existir, cria
}


// ========== CONFIGURAÇÃO DO UPLOAD COM MULTER ==========
const storage = multer.diskStorage({
    // destino da imagem
    destination: "uploads/",

    // renomeia a imagem para evitar conflitos com arquivos de mesmo nome
    filename: (_, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname) // gera nome único: timestamp + extensão
        );
    }
});

// ativa o multer com o storage configurado
const upload = multer({ storage });


// ========== ROTA PARA CADASTRAR A PIZZA ==========
router.post("/", upload.single("imagem"), async (req, res) => {
    try {
        // pegando dados enviados no formulário
        const { pizza, ingredientes, preco } = req.body;
        const imagemUrl = req.file?.filename; // nome salvo no servidor (ex: 1731287328123.png)

        // conversão de preco para número
        const precoNum = parseFloat(preco);

        // valida se todos os dados foram preenchidos
        if (!pizza || !ingredientes || !preco || !imagemUrl || isNaN(precoNum)) {
            return res.status(400).json({ error: "Preencha todos os campos!" });
        }

        // abre a pool de conexões com o banco
        const pool = await getPool();

        // INSERE a pizza no banco
        await pool.request()
            .input("pizza", pizza)
            .input("ingredientes", ingredientes)
            .input("preco", precoNum)
            .input("imagemUrl", imagemUrl)
            .query(`
                INSERT INTO PIZZA (PIZZA, INGREDIENTES, PRECO, IMAGEM_URL)
                VALUES (@pizza, @ingredientes, @preco, @imagemUrl)
            `);

        // retorna resposta de sucesso para o frontend
        res.status(201).json({ message: "Pizza cadastrada com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar no banco" });
    }
});


// ========== ROTA PARA DELETAR PIZZA POR ID OU NOME ==========
router.delete("/", async (req, res) => {
    try {
        const { id, nome } = req.body;
        const pool = await getPool();

        // valida se recebeu ID ou nome
        if (!id && !nome) {
            return res.status(400).json({ error: "Envie o ID ou o nome da pizza" });
        }

        // se recebeu id → deletar por id
        if (id) {
            await pool.request()
                .input("id", Number(id))
                .query(`DELETE FROM PIZZA WHERE PIZZA_ID = @id`);
        }

        // se recebeu nome → deletar por nome
        if (nome) {
            await pool.request()
                .input("nome", nome)
                .query(`DELETE FROM PIZZA WHERE PIZZA = @nome`);
        }

        res.json({ message: "Pizza removida com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao remover pizza" });
    }
});

// LISTAR PIZZAS DO BANCO DE DADOS
router.get("/listar", async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT PIZZA_ID, PIZZA, INGREDIENTES, PRECO, IMAGEM_URL
            FROM PIZZA
            ORDER BY PIZZA_ID DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error("Erro ao listar pizzas:", error);
        res.status(500).json({ error: "Erro ao listar pizzas" });
    }
});

// exporta o router para ser usado no servidor principal
export default router;
