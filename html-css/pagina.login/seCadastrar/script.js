document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // evita envio padrão

    const email = document.getElementById('email').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const cpf = document.getElementById('CPF').value.trim();
    const telefone = document.getElementById('Telefone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // ----- Validações -----
    if (!email || !usuario || !cpf || !telefone || !password || !confirmPassword) {
        alert("Preencha todos os campos.");
        return;
    }

    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    // Validação do e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
        alert("Insira um e-mail válido.");
        return;
    }

    // ----- Enviar para o BACKEND -----
    try {
        const resposta = await fetch("http://localhost:3000/clientes/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                usuario,
                senha: password,
                cpf,
                telefone
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao cadastrar.");
            return;
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "/html-css/pagina.menu/index.html";

    } catch (erro) {
        console.error("Erro ao enviar cadastro:", erro);
        alert("Erro no servidor. Veja o console.");
    }
});
