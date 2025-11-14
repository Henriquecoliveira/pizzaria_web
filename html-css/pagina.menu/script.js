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

// ================= PAGAMENTO =================

// quando o usuário selecionar forma de pagamento
function configurarPagamento() {
  const radios = document.querySelectorAll('input[name="pagamento"]');
  const display = document.getElementById('pagamentoSelecionado');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      display.textContent = "Pagamento: " + radio.value;
    });
  });
}

// garantir que a seleção aparece ao abrir o modal (caso já tenha selecionado antes)
function atualizarPagamentoSelecionado() {
  const selecionado = document.querySelector('input[name="pagamento"]:checked');
  const display = document.getElementById('pagamentoSelecionado');

  if (selecionado) {
    display.textContent = "Pagamento: " + selecionado.value;
  } else {
    display.textContent = "";
  }
}

// CHAMAR sempre que abrir o modal
const abrirModal_original = abrirModal;
abrirModal = function () {
  abrirModal_original();
  configurarPagamento();
  atualizarPagamentoSelecionado();
};

// ================= FINALIZAR PEDIDO =================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnFinalizarPedido");

  if (btn) {
    btn.addEventListener("click", () => {
      const metodo = document.querySelector('input[name="pagamento"]:checked');
      const total = document.getElementById("totalRecibo").textContent;

      if (!metodo) {
        alert("Selecione uma forma de pagamento antes de finalizar o pedido!");
        return;
      }

      alert(
        "Pedido finalizado!\n" +
        total + "\n" +
        "Pagamento: " + metodo.value
      );

      // 🔥 RECARREGA A PÁGINA APÓS CONFIRMAR
      location.reload();
    });
  }
});
