 document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = '/html-css/pagina.login/login/index.html';
 });

  document.getElementById('peca.aqui').addEventListener('click', () => {
    window.location.href = '/html-css/pagina.menu/index.html'; 
 });


function abrirModal() {
    document.getElementById('minhaModal').style.display = 'flex';
  }

  function fecharModal() {
    document.getElementById('minhaModal').style.display = 'none';
  }