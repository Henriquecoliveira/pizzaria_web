"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_pizzaria_1 = require("./db_pizzaria");
(async () => {
    try {
        const resultado = await (0, db_pizzaria_1.buscarUsuarios)('ri');
        console.log("Resultado da busca:");
        console.table(resultado.recordset); // Mostra os dados formatados
    }
    catch (err) {
        console.error("Erro ao buscar usuários:", err);
    }
    finally {
        await (0, db_pizzaria_1.fecharPool)();
    }
})();
