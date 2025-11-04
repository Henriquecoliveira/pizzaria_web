"use strict";
// Essa parte do código serve para fazer a conexão com o banco de dados SQL Server
// usando o pacote 'mssql'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
exports.buscarUsuarios = buscarUsuarios;
exports.fecharPool = fecharPool;
const mssql_1 = __importDefault(require("mssql")); // ponto de atenção, sobre o diretório que o gpt direcionou o mssql1
// configuração da conexão ao banco de dados
const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || 'P@ssw0rd',
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'PIZZARIA',
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false, // ponto de atenção caso a conexão não funcione!!! (não sei se é encriptado)
    },
    // define o tammanho da poll de conexões
    // basicamente para não haver várias aberturas desnecessárias de conexão ao banco
    // já é delimitado um máximo de conexões simultâneas que o programa "empresta" ao usuário
    pool: {
        max: 5, // máximo de conexões na pool
        min: 0, // mínimo de conexões na pool
        idleTimeoutMillis: 20000 // tempo para fechar conexões ociosas
    }
};
let pool = null; // guarda a pool de conexões
// abre (ou reusa) a pool de conexões
async function getPool() {
    if (pool && pool.connected)
        return pool; // verifica se já existe uma pool & se ela está conectada
    pool = await mssql_1.default.connect(config);
    return pool; // retorna a conexão para quem chamou a função
}
// exemplo de query para buscar usuários no banco de dados
async function buscarUsuarios(usuario) {
    const p = await getPool(); // garante que estamos conectados à pool
    // .input define parâmetros tipados, evita concatenar strings na query
    const result = await p.request() // cria uma nova query no db isolada, assim não há conflito entre várias requisições
        .input('USUARIO', mssql_1.default.VarChar(100), `%${usuario}%`) // formata o parâmetro, prevenindo SQL Injection
        .query('SELECT USUARIO_ID, USUARIO, EMAIL, CPF, TELEFONE, RUA, CIDADE, BAIRRO, NUMERO_CASA FROM CLIENTES WHERE USUARIO LIKE @USUARIO');
    return result;
}
/** Fecha a pool (útil em scripts / testes) */
async function fecharPool() {
    if (pool) {
        await pool.close();
        pool = null;
    }
}
