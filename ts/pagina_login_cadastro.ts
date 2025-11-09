// importando bibliotecas necessárias para a operação com o banco de dados
import sql, { IResult, ConnectionPool } from 'mssql';
import { getPool } from './db_pizzaria';
import { Cliente } from './models/cliente';

// Insere um novo cliente no banco (query parametrizada).
// Recebe o objeto Cliente e retorna o resultado do INSERT.

export async function cadastrarCliente(cliente: Cliente): Promise<IResult<any>> {
  const pool: ConnectionPool = await getPool(); // garante que estamos conectados à pool
  const result = await pool.request()
    .input('email', sql.VarChar(100), cliente.email) // adiciona parâmetro nomeado @email do tipo VarChar(100) com valor cliente.email.
    .input('usuario', sql.VarChar(100), cliente.usuario)
    .input('senha', sql.VarChar(255), cliente.senha)
    .input('cpf', sql.VarChar(11), cliente.cpf ?? '')
    .input('telefone', sql.VarChar(20), cliente.telefone ?? '')
    .query(`
      INSERT INTO CLIENTES (EMAIL, USUARIO, SENHA, CPF, TELEFONE)
      VALUES (@email, @usuario, @senha, @cpf, @telefone);
      SELECT SCOPE_IDENTITY() AS usuarioId; -- retorna o id gerado
    `);

  return result; // caller pode ler result.recordset[0].usuarioId
}
