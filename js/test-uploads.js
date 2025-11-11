// ================== TESTE DE DIAGNÓSTICO UPLOAD & IMAGEM ==================
//
// Salve este arquivo como js/test-uploads.js (ou substitua o existente).
// Execute com: node ./js/test-uploads.js
//

import fs from "fs";
import fetch from "node-fetch";
import sql from "mssql";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config do banco (ajuste se necessário)
// ATENÇÃO: atualize user/password/database conforme seu ambiente
const dbConfig = {
  user: "sa",
  password: "P@ssw0rd",
  server: "localhost",
  database: "PIZZARIA",
  options: { encrypt: false, trustServerCertificate: true }
};

async function main() {
  console.log("\n🔎 Iniciando diagnóstico...\n");

  // 1 - Verificar pasta uploads
  // IMPORTANTE: o script está em js/, a pasta real de uploads está UM NÍVEL ACIMA (raiz do projeto).
  // Por isso usamos "../uploads" a partir de __dirname.
  const uploadDir = path.join(__dirname, "../uploads");
  console.log("📁 Caminho que vamos verificar:", uploadDir);
  console.log("📁 Pasta uploads existe?", fs.existsSync(uploadDir));

  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    console.log("📂 Arquivos na pasta uploads:", files.length > 0 ? files : "Nenhum arquivo encontrado");
  } else {
    console.log("⚠ A pasta uploads NÃO foi encontrada nesse caminho. Verifique onde ela está.");
  }

  // 2 - Testar acesso HTTP via servidor (usa o primeiro arquivo da pasta, se existir)
  try {
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      const sample = files[0];
      if (sample) {
        const url = `http://localhost:3000/uploads/${encodeURIComponent(sample)}`;
        const res = await fetch(url);
        console.log(`🌐 HTTP GET ${url} →`, res.status);
      } else {
        console.log("⚠ Não há arquivos na pasta uploads para testar via HTTP.");
      }
    } else {
      console.log("⚠ Pulando teste HTTP porque a pasta uploads não existe nesse caminho.");
    }
  } catch (e) {
    console.log("❌ Erro ao testar URL HTTP", e.message);
  }

  // 3 - Testar se imagens referenciadas no banco estão acessíveis
  try {
    const pool = await sql.connect(dbConfig);
    // pega os primeiros registros pra testar; adapte se quiser
    const result = await pool.request().query("SELECT TOP 5 IMAGEM_URL FROM PIZZA");

    console.log("\n🍕 Registros no banco com IMAGEM_URL:");
    if (!result.recordset || result.recordset.length === 0) {
      console.log("⚠ Nenhuma pizza encontrada no banco!");
    } else {
      for (const row of result.recordset) {
        const img = row.IMAGEM_URL;
        if (!img) {
          console.log("🖼 Entrada sem IMAGEM_URL encontrada no banco.");
          continue;
        }

        // monta a URL pública que o front usa
        const url = `http://localhost:3000/uploads/${encodeURIComponent(img)}`;

        try {
          const res = await fetch(url);
          console.log(`🖼 ${img} → HTTP ${res.status} → ${res.status === 200 ? "✅ OK" : "❌ Falhou"}`);
        } catch (err) {
          console.log(`🖼 ${img} → ❌ Erro ao acessar: ${err.message}`);
        }
      }
    }

    // fecha a pool de conexões ao terminar (bom para scripts)
    await pool.close();
  } catch (e) {
    console.log("❌ Erro ao conectar no banco:", e.message);
  }

  console.log("\n✅ Diagnóstico finalizado.\n");
}

main();
