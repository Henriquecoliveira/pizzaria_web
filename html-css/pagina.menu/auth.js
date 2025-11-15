document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuarioLogado");

    if (!usuario) {
        // caminho absoluto, evita concatenação com pasta atual
        window.location.href = "/html-css/pagina.login/login/index.html";
    }
});
