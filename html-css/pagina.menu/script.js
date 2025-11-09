 document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = '/pagina.login/login/index.html'; // Aqui vai a URL que você quer abrir
 });

 function abrirModal() {
    document.getElementById('minhaModal').style.display = 'flex';
  }

  function fecharModal() {
    document.getElementById('minhaModal').style.display = 'none';
  }