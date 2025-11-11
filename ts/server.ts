// server
// ele serve para criar o servidor que fará a comunicação entre o frontend + backend + banco de dados

// imports de bibliotecas externas
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path, { resolve } from 'path'; // manipulação de caminhos
import { fileURLToPath } from "url"; // permite obter o __dirname no ES Modules

// imports locais
import pizzaRoutes from './routes/pizzaRoutes.js';

const app = express();

// ===== DEFINE __dirname (necessário para resolver caminhos corretamente) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Permite chamadas externas (evita erro de CORS no front)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// suporte explícito ao preflight do navegador (OPTIONS)
app.options(/.*/, cors());

// converte o corpo das requisições para JSON
app.use(bodyParser.json());

// ✅ Define o caminho correto e absoluto da pasta uploads
const uploadPath = resolve(__dirname, "..", "uploads");

// Log para depurar se o Express realmente está apontando para a pasta correta
console.log("📁 Servindo uploads de:", uploadPath);

// ✅ Torna a pasta uploads acessível via navegador
// Exemplos que devem funcionar:
// http://localhost:3000/uploads/NOME_DA_IMAGEM.png
app.use("/uploads", express.static(uploadPath));

// ✅ Ajusta regras do CSP para não bloquear imagens carregadas do servidor
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:;"
  );
  next();
});

// ✅ Evita erro de favicon 404 no console do navegador
app.get("/favicon.ico", (req, res) => res.status(204));

// usa as rotas relacionadas a pizzas (cadastro, delete, etc)
app.use('/pizza', pizzaRoutes);

// inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
