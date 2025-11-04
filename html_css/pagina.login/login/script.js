document.getElementById('Login').addEventListener('click', (event) => {
    event.preventDefault(); // <- Isso evita que o form recarregue a página
    window.location.href = '/pagina_principal/index.html';
});
