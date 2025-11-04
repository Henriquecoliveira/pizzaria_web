document.getElementById('form').addEventListener('submit', async (event) => {
  event.preventDefault();

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

  // dados mínimos para cadastro; você pode coletar mais campos depois (endereço)
  const payload = {
    email,
    usuario,
    password
  };

  try {
    // envia para o backend (assumindo que o backend roda na mesma origem / ou ajustar URL)
    const resp = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ message: 'Erro desconhecido' }));
      alert('Falha ao cadastrar: ' + (err.message || resp.statusText));
      return;
    }

    const data = await resp.json();
    alert('Cadastro validado e salvo com sucesso!');

    // opcional: guardar id retornado para próxima etapa (localStorage)
    if (data.usuarioId) localStorage.setItem('usuarioId', data.usuarioId);

    // Redireciona para próxima página
    window.location.href = '/pagina.login/seCadastrar/proximo_passo/endereco.html';
  } catch (error) {
    console.error(error);
    alert('Erro de comunicação com o servidor.');
  }
});
