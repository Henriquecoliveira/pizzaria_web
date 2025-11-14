document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("loginInput").value; // <-- ALTERADO
    const senha = document.getElementById("senhaInput").value;

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha }) // <-- login aqui!
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Login realizado com sucesso!");
            window.location.href = "../../pagina.menu/index.html";
        } else {
            alert(dados.error || "Credenciais inválidas.");
        }

    } catch (erro) {
        alert("Erro ao conectar ao servidor.");
        console.error("ERRO:", erro);
    }
});
