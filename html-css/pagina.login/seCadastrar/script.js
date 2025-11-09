document.getElementById('form').addEventListener('submit', (event) => {
   event.preventDefault(); // previne o envio padrão para validar primeiro

   const email = document.getElementById('email').value.trim();
   const password = document.getElementById('password').value;
   const confirmPassword = document.getElementById('confirmPassword').value;
   const usuario = document.getElementById('usuario').value.trim();

   if (!email || !password || !confirmPassword || !usuario) {
       alert('Por favor, preencha todos os campos.');
       return;
   } 

   if (password !== confirmPassword) {
       alert('As senhas não coincidem.');
       return;
   }


   const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailValido.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
   }

   // Se chegou aqui, está tudo certo
   alert('Cadastro validado com sucesso!');

   // Redireciona para próxima página
   window.location.href = '/pagina.login/seCadastrar/proximo_passo/endereco.html';
});
