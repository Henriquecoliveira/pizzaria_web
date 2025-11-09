# Como rodar o projeto Pizzaria

## Pré-requisitos:
- Node.js 18+
- VS Code
- Extensão: Live Server (VS Code)
- Docker
- Imagem SQL Server 2022+

---

## Passos
0. Abra uma imagem SQL pelo Docker e execute a criação do BD que está em ./db.pizzaria.sql

1. Abra a pasta do projeto no terminal:
   cd pizzaria/

2. Instale as dependências:
   npm install

3. Inicie o servidor backend:
   node ./js/server.js

4. Se aparecer no terminal:
   "Servidor rodando na porta 3000"
   → O backend está funcionando ✅

5. No VS Code, abra o arquivo:
   ./ts/cadastrarPizzasTeste.html

6. Clique com o botão direito no arquivo e selecione:
   **Open with Live Server**

7. No navegador, preencha o formulário e clique em **Salvar**

---

## Observações

- O backend roda em:  http://localhost:3000
- O frontend (Live Server) abre em: http://127.0.0.1:5500
- Eles são diferentes, e é normal.
- O formulário precisa enviar os dados para o backend (porta 3000).

---

Se o formulário salvar sem erros no console (F12 → Console), está funcionando ✅
