// server
// ele serve para criar o servidor que fará a comunicação entre o frontend + backend + banco de dados

// imports de bibliotecas externas
import express from 'express'; // framework nodeJS para criar APIS e gerenciar rotas
import bodyParser from 'body-parser'; // converte o corpo das requisições em JSON
import cors from 'cors';

// imports locais

const app = express(); // cria a aplicação express

// permite requisições do frontend
app.use(cors());

// converte o corpo das requisições de strings para JSON
app.use(bodyParser.json());

// inicia o servidor
const PORT = process.env.PORT || 3000; // porta padrao 3000 usada pelo nodeJS em desenvolvimento de servidores web 
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
