document.getElementById('form2').addEventListener('submit', (event) => {
   event.preventDefault(); // previne o envio padrão para validar primeiro

   const cpf = document.getElementById('cpf').value.trim();
   const telefone = document.getElementById('telefone').value.trim();
   const rua = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();

   if (!cpf || !telefone || !rua || !numero) {
         alert('Por favor, preencha todos os campos.');
            return;
    }

   const cpfLimpo = cpf.replace(/\D/g, '');
   if (cpfLimpo.length !== 11) {
      alert('CPF deve conter exatamente 11 números.');
      return;
   }
   for (let i = 0; i < 10; i++) {
      if (cpfLimpo === String(i).repeat(11)) {
         alert('CPF inválido.');
         return;
      }
   }
 

    if (isNaN(numero) || Number(numero) <= 0) {
        alert('Número deve ser um valor numérico positivo.');
        return;
    }
    alert('Cadastro fizalizado com sucesso!');
    window.location.href = '/pagina.login/login/index.html';
});
