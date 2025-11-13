// ================= LOGIN =================
document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = '/html-css/pagina.login/login/index.html'; // Aqui vai a URL que você quer abrir
});


// ================= MODAL (sacola de pedidos) =================

// Função para abrir o modal
function abrirModal() {
  document.getElementById('minhaModal').style.display = 'flex';
  atualizarRecibo(); // sempre atualiza o recibo ao abrir
}

// Função para fechar o modal
function fecharModal() {
  document.getElementById('minhaModal').style.display = 'none';
}


// ================= RECIBO =================

// Função que monta o recibo com base nas pizzas selecionadas
function atualizarRecibo() {
  const listaRecibo = document.getElementById('listaRecibo');
  const totalRecibo = document.getElementById('totalRecibo');
  listaRecibo.innerHTML = '';

  let total = 0;

  // percorre todas as pizzas do menu
  const pizzas = document.querySelectorAll('.pizza');

  pizzas.forEach(pizza => {
    const nome = pizza.querySelector('h2').textContent;
    const preco = parseFloat(pizza.querySelector('.price').textContent.replace('R$', '').trim());
    const quantidade = parseInt(pizza.querySelector('.contador').textContent);

    // só mostra no recibo se a pizza tiver quantidade > 0
    if (quantidade > 0) {
      const subtotal = preco * quantidade;
      total += subtotal;

      const item = document.createElement('li');
      item.textContent = `${nome} — ${quantidade}x = R$ ${subtotal.toFixed(2)}`;
      listaRecibo.appendChild(item);
    }
  });

  // mostra o total formatado
  totalRecibo.textContent = `Total: R$ ${total.toFixed(2)}`;
}
