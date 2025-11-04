// server
// ele serve para criar o servidor que fará a comunicação entre o frontend + backend + banco de dados

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { cadastrarCliente } from './pagina_login_cadastro';
import { Cliente } from './models/cliente';

const app = express();

// permite requisições do frontend
app.use(cors());

// interpreta o corpo JSON das requisições
app.use(bodyParser.json());

// rota para cadastrar usuário
app.post('/api/usuarios', async (req, res) => {
  try {
    const { email, usuario, password, cpf, telefone, rua, cidade, bairro, numero_casa } = req.body;

    // validação básica
    if (!email || !usuario || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios: email, usuario e password.' });
    }

    // monta o objeto do cliente
    const cliente: Cliente = {
      email,
      usuario,
      senha: password, // senha em texto simples (como pedido)
      cpf,
      telefone,
      rua,
      cidade,
      bairro,
      numero_casa
    };

    // cadastra no banco
    const result = await cadastrarCliente(cliente);
    const usuarioId = result.recordset && result.recordset[0] ? result.recordset[0].usuarioId : null;

    // resposta de sucesso
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuarioId });
  } catch (err: any) {
    console.error('Erro ao cadastrar:', err);
    return res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
  }
});

// inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
