// PROTEGE TODAS AS PÁGINAS INTERNAS
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuarioLogado");

    if (!usuario) {
        window.location.href = "/html-css/pagina.login/login/index.html";
    }
});
