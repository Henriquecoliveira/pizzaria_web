// server
// ele serve para criar o servidor que fará a comunicação entre o frontend + backend + banco de dados
// imports de bibliotecas externas
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'; // ← novo
import { fileURLToPath } from "url";
// imports locais
import pizzaRoutes from './routes/pizzaRoutes.js';
const app = express();
// Permite chamadas externas (corrigido e adicionando métodos que faltavam)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ← agora DELETE e OPTIONS são permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // ← garante que o envio do JSON funcione
}));
// suporte explícito ao preflight do navegador (OPTIONS)
app.options(/.*/, cors());
// converte o corpo das requisições de strings para JSON
app.use(bodyParser.json());
// Serve arquivos estáticos desde a raiz do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// usa as rotas de pizza
app.use('/pizza', pizzaRoutes);
// inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
