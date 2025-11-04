import { buscarUsuarios, fecharPool } from './db_pizzaria';

(async () => {
  try {
    const resultado = await buscarUsuarios('ri');
    console.log("Resultado da busca:");
    console.table(resultado.recordset); // Mostra os dados formatados
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
  } finally {
    await fecharPool();
  }
})();

// funcionou, não sei como!!! :)