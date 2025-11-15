import { getPool } from './db_pizzaria';
(async () => {
    try {
        const pool = await getPool();
        const r = await pool.request().query("SELECT TOP 1 1 AS ok");
        console.log("DB OK", r.recordset);
    }
    catch (e) {
        console.error("DB ERROR", e);
    }
})();
