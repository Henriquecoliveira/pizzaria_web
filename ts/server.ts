// server.ts
// ele serve para criar o servidor que fará a comunicação entre o frontend + backend + banco de dados

// imports de bibliotecas externas
import express from 'express';
import cors from 'cors';
import path, { resolve } from 'path';
import { fileURLToPath } from "url";

// imports locais
import pizzaRoutes from './routes/pizzaRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import reportRoutes from "./routes/reportRoutes.js";


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
// (❗ bodyParser removido porque express.json já faz isso)
app.use(express.json());

// configura o express para entender dados enviados via formulário
app.use(express.urlencoded({ extended: true }));

// Define o caminho correto da pasta uploads
const uploadPath = resolve(__dirname, "..", "uploads");
console.log("📁 Servindo uploads de:", uploadPath);

// Torna a pasta uploads acessível via navegador
app.use("/uploads", express.static(uploadPath));

// Torna a pasta html-css acessível via navegador
app.use('/html-css', express.static(path.join(__dirname, '../html-css')));

// Ajusta regras do CSP para permitir imagens
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:;"
  );
  next();
});

// Evita erro de favicon no console
app.get("/favicon.ico", (req, res) => res.status(204));

// usa as rotas relacionadas a pizzas
app.use('/pizza', pizzaRoutes);

// usa as rotas relacionadas a login  (COMPATIBILIDADE GARANTIDA)
app.use('/login', loginRoutes);

// usa as rotas relacionadas a pedidos
app.use('/pedido', pedidoRoutes);

// usa as rotas relacionadas a relatórios
app.use("/relatorio", reportRoutes);

// inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
