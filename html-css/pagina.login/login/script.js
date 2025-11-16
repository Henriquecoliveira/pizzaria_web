document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("loginInput").value;
    const senha = document.getElementById("senhaInput").value;

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha })
        });

        const dados = await resposta.json();
        console.log("RESPOSTA DO LOGIN:", dados);

        // CASO LOGIN FALHE
        if (!resposta.ok || !dados.sucesso) {
            alert("Login ou senha incorretos!");
            return;
        }

        // DADOS VINDOS DO BACKEND
        const usuario = dados.dados; 
        // { USUARIO_ID, EMAIL, USUARIO, USER_LEVEL }

        // SALVA CADA CAMPO CORRETAMENTE
        sessionStorage.setItem("usuarioId", usuario.USUARIO_ID);
        sessionStorage.setItem("usuarioEmail", usuario.EMAIL);
        sessionStorage.setItem("usuarioNome", usuario.USUARIO);
        sessionStorage.setItem("usuarioNivel", usuario.USER_LEVEL);

        // guarda o objeto completo também
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        alert("Login realizado com sucesso!");

        // ======= REDIRECIONAMENTO DO ADMIN =======
        // ADMIN POR EMAIL
        const isAdminEmail = usuario.EMAIL === "admin@gmail.com";

        // ADMIN POR USUÁRIO + SENHA DIGITADOS
        const isAdminCredenciais = 
            usuario.USUARIO?.toLowerCase() === "admin" && senha === "admin123";

        if (isAdminEmail || isAdminCredenciais) {
            window.location.href = "../../pagina_administrativa/index.html";
            return;
        }
        // =========================================

        // REDIRECIONAMENTO PADRÃO PARA CLIENTES
        window.location.href = "../../pagina.menu/index.html";

    } catch (erro) {
        alert("Erro ao conectar ao servidor.");
        console.error("ERRO:", erro);
    }
});
