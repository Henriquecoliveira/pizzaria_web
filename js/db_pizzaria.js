// Essa parte do código serve para fazer a conexão com o banco de dados SQL Server
// usando o pacote 'mssql'
import sql from 'mssql';
// configuração da conexão ao banco de dados
const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || 'P@ssw0rd',
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'PIZZARIA',
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false, // para conexões locais, geralmente é false
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
export async function getPool() {
    if (pool && pool.connected)
        return pool; // verifica se já existe uma pool & se ela está conectada
    pool = await sql.connect(config);
    return pool; // retorna a conexão para quem chamou a função
}
/** Fecha a pool (útil em scripts / testes) */
export async function fecharPool() {
    if (pool) {
        await pool.close();
        pool = null;
    }
}
