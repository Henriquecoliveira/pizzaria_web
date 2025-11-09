// server
// ele serve para criar o servidor que fará a comunicação entre o frontend + backend + banco de dados

// imports de bibliotecas externas
import express from 'express'; // framework nodeJS para criar APIS e gerenciar rotas
import bodyParser from 'body-parser'; // converte o corpo das requisições em JSON
import cors from 'cors';

// imports locais
import { cadastrarCliente } from './pagina_login_cadastro'; // função para cadastrar cliente no banco
import { Cliente } from './models/cliente'; // interface Cliente

const app = express(); // cria a aplicação express

// permite requisições do frontend
app.use(cors());

// converte o corpo das requisições de strings para JSON
app.use(bodyParser.json());

// rota para cadastrar usuário
app.post('/api/usuarios', async (req, res) => {

    const { email, usuario, senha, cpf, telefone } = req.body;
    // extrai cada campo do corpo da requisição


    // monta o objeto do cliente
    const cliente: Cliente = {
      email,
      usuario,
      senha,
      cpf,
      telefone,
    };

    // cadastra no banco
    await cadastrarCliente(cliente);
    res.send("Usuário cadastrado com sucesso!");

}); 

// inicia o servidor
const PORT = process.env.PORT || 3000; // porta padrao 3000 usada pelo nodeJS em desenvolvimento de servidores web 
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
