🍕 Como Iniciar o Projeto Pizzaria: Guia Completo

Este guia detalha os passos necessários para configurar e executar o projeto Pizzaria, que inclui um backend em Node.js e um frontend básico.

🛠️ Pré-requisitos Essenciais

Certifique-se de que os seguintes programas e ferramentas estejam instalados em seu sistema:

    Node.js (versão 18 ou superior): Necessário para executar o servidor backend.

    VS Code: O editor de código recomendado.

    Extensão Live Server (VS Code): Utilizada para hospedar o frontend.

    Docker: Essencial para rodar a instância do banco de dados.

    SMSS(SQL Server Management Studio): Usado para rodar o banco de dados 

    Imagem SQL Server (versão 2022 ou superior): O banco de dados a ser utilizado.

🚀 Passos para Execução

Siga a ordem dos passos para garantir a correta inicialização do projeto.

1. Configuração do Banco de Dados (SQL Server via Docker)

O banco de dados deve ser configurado e iniciado antes do servidor backend.

    Abertura da Imagem: Inicie um container da imagem SQL Server através do Docker.

    Criação do BD: Execute o script de criação do banco de dados e suas tabelas, localizado em: ./db.pizzaria.sql, no SQL Server Management Studio abra a aba de conectar e preencha os campos de porta, nome e senha, respectivamente:

Porta: 1433:1433
Nome: localhost
Senha: P@ssw0rd

2. Preparação do Projeto

    Acesso ao Diretório: No terminal, navegue até a pasta raiz do projeto:
    Bash

cd pizzaria/

Instalação de Dependências: Instale todos os pacotes Node.js necessários para o backend:
Bash

    npm install

3. Inicialização do Backend (Node.js)

    Início do Servidor: Execute o arquivo principal do servidor Node.js:
    Bash

    node ./js/server.js

    Verificação: O servidor está funcionando corretamente se a seguinte mensagem aparecer no terminal:

        "Servidor rodando na porta 3000"

    ✅ O backend agora está acessível em: http://localhost:3000

4. Inicialização do Frontend (Live Server)

O frontend será executado através da extensão Live Server do VS Code.

    Abertura do Arquivo: No VS Code, localize e abra o arquivo: ./ts/cadastrarPizzasTeste.html

    Início do Live Server: Clique com o botão direito no arquivo e selecione a opção: Open with Live Server

    ✅ O frontend abrirá automaticamente no seu navegador, geralmente em: http://127.0.0.1:5500

⚙️ Teste e Validação

Para validar o funcionamento integrado do projeto (Frontend ↔ Backend ↔ BD):

    No navegador, preencha o formulário de cadastro de pizzas.

    Clique no botão Salvar.

Validação de Sucesso:

    Se o formulário salvar os dados sem exibir erros no console do navegador (abra com F12), o projeto está funcionando corretamente.

    Importante: Os endereços do frontend (http://127.0.0.1:5500) e do backend (http://localhost:3000) são diferentes, o que é esperado. O formulário frontend deve estar configurado para enviar os dados para a porta 3000 do backend.