// imports externos
import { Router } from "express"; // cria a rota da API
import multer from "multer"; // vai receber os arquivos enviados via formulário (imagem da pizza)
import path from "path"; // manipula caminho de arquivos 
import fs from "fs"; // le e cria pastas e arquivos no sistema

// imports locais
import { getPool } from "../db_pizzaria"; // função que abre a conexão com o banco de dados

const router = Router(); // cria um mini servidor de rotas, para a imagem da pizza

// Criar pasta uploads se não existir
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Configuração do upload
const storage = multer.diskStorage({
    destination: "uploads/", // salva os arquivos na pasta uploads
    filename: (_, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // rennomeia o arquivo para a data em milisegundos + extensão original
    }
});

const upload = multer({ storage }); // ativa o upload

router.post("/", upload.single("imagem"), async (req, res) => {
    try {
        // pegando dados do formulário
        const { pizza, ingredientes, preco } = req.body;
        const imagemUrl = req.file?.filename;

        // convertendo preco para número
        const precoNum = parseFloat(preco);

        // validando esses dados
        // agora também verifica se preco é um número válido
        if (!pizza || !ingredientes || !preco || !imagemUrl || isNaN(precoNum)) {
            return res.status(400).json({ error: "Preencha todos os campos!" });
        }

        // salvando no banco de dados
        // abre a pool de conexões
        const pool = await getPool();

        // insere a pizza no banco
        await pool.request()
            .input("pizza", pizza)
            .input("ingredientes", ingredientes)
            .input("preco", precoNum)
            .input("imagemUrl", imagemUrl)
            .query(`
                INSERT INTO PIZZA (PIZZA, INGREDIENTES, PRECO, IMAGEM_URL)
                VALUES (@pizza, @ingredientes, @preco, @imagemUrl)
            `);

        res.status(201).json({ message: "Pizza cadastrada com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar no banco" });
    }
});

export default router;
