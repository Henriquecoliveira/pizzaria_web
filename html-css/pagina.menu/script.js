// ================= LOGIN =================
document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = '/html-css/pagina.login/login/index.html';
});


// ================= MODAL (sacola de pedidos) =================

// Recria a função atualizarRecibo — ESSENCIAL para mostrar itens no pop-up
function atualizarRecibo() {
  const listaRecibo = document.getElementById('listaRecibo');
  const totalRecibo = document.getElementById('totalRecibo');

  listaRecibo.innerHTML = "";
  let total = 0;

  // percorre todas as pizzas renderizadas na página
  const pizzas = document.querySelectorAll('.pizza');

  pizzas.forEach(pizza => {
    const nome = pizza.querySelector('h2').textContent;
    const preco = parseFloat(pizza.querySelector('.price').textContent.replace('R$', '').trim());
    const quantidade = parseInt(pizza.querySelector('.contador').textContent);

    if (quantidade > 0) {
      const subtotal = preco * quantidade;
      total += subtotal;

      const li = document.createElement("li");
      li.textContent = `${nome} — ${quantidade}x = R$ ${subtotal.toFixed(2)}`;
      li.setAttribute("data-alimento", nome);
      li.setAttribute("data-preco", subtotal.toFixed(2));
      listaRecibo.appendChild(li);
    }
  });

  totalRecibo.textContent = `Total: R$ ${total.toFixed(2)}`;
}


// ======== PAGAMENTO ========

function configurarPagamento() {
  const radios = document.querySelectorAll('input[name="pagamento"]');
  const display = document.getElementById('pagamentoSelecionado');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      display.textContent = "Pagamento: " + radio.value;
    });
  });
}

function atualizarPagamentoSelecionado() {
  const selecionado = document.querySelector('input[name="pagamento"]:checked');
  const display = document.getElementById('pagamentoSelecionado');
  display.textContent = selecionado ? "Pagamento: " + selecionado.value : "";
}


// ================= MODAL =================

// Abre o pop-up corretamente (com recibo e pagamento)
function abrirModal() {
  const modal = document.getElementById("minhaModal");
  if (modal) modal.style.display = "flex";

  atualizarRecibo();
  configurarPagamento();
  atualizarPagamentoSelecionado();
}

// Fecha o pop-up
function fecharModal() {
  const modal = document.getElementById("minhaModal");
  if (modal) modal.style.display = "none";
}



// ================= FINALIZAR PEDIDO (BACKEND) =================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnFinalizarPedido");

  if (btn) {
    btn.addEventListener("click", async () => {
      // AUTENTICAÇÃO
      const usuarioJson = sessionStorage.getItem("usuarioLogado");
      if (!usuarioJson) {
        alert("Você precisa estar logado para finalizar o pedido.");
        window.location.href = "/html-css/pagina.login/login/index.html";
        return;
      }

      let usuario;
      try {
        usuario = JSON.parse(usuarioJson);
      } catch (e) {
        console.error("Erro ao ler usuário da sessionStorage:", e);
        alert("Erro com a sessão. Faça login novamente.");
        window.location.href = "/html-css/pagina.login/login/index.html";
        return;
      }

      const metodo = document.querySelector('input[name="pagamento"]:checked');
      if (!metodo) {
        alert("Selecione uma forma de pagamento!");
        return;
      }

      const endereco = document.getElementById("enderecoComentario").value.trim();

      // CAPTURA LISTA DO RECIBO
      const listaRecibo = document.getElementById("listaRecibo");
      const itens = [];

      Array.from(listaRecibo.children).forEach(li => {
        itens.push({
          alimento: li.getAttribute("data-alimento"),
          preco: Number(li.getAttribute("data-preco"))
        });
      });

      if (itens.length === 0) {
        alert("Carrinho vazio!");
        return;
      }

      // PAYLOAD
      const payload = {
        usuarioId: usuario.USUARIO_ID || usuario.id,
        formaPagamento: metodo.value,
        endereco,
        itens
      };

      try {
        const resp = await fetch("/pedido/finalizar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const dados = await resp.json();

        if (!resp.ok) {
          alert(dados.error || "Erro ao finalizar pedido.");
          return;
        }

        alert("Pedido finalizado com sucesso! ID: " + (dados.pedidoId || "não retornado"));
        location.reload();

      } catch (err) {
        console.error("Erro ao enviar pedido:", err);
        alert("Erro de comunicação com o servidor.");
      }
    });
  }
});
