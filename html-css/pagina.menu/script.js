// ================= LOGIN =================
document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = '/html-css/pagina.login/login/index.html';
});

// garante que o usuário esteja logado
document.addEventListener("DOMContentLoaded", () => {
  const usuario = sessionStorage.getItem("usuarioLogado");
  if (!usuario) {
    window.location.href = "/html-css/pagina.login/login/index.html";
    return;
  }
});


// =================== RECIBO ===================

// Monta o recibo lendo diretamente as pizzas da página menu
function atualizarRecibo() {
  const listaRecibo = document.getElementById('listaRecibo');
  const totalRecibo = document.getElementById('totalRecibo');

  if (!listaRecibo || !totalRecibo) return; // evita erro silencioso

  listaRecibo.innerHTML = "";
  let total = 0;

  const pizzas = document.querySelectorAll('.pizza');

  pizzas.forEach(pizza => {
    const nome = pizza.querySelector('h2')?.textContent;
    const precoTexto = pizza.querySelector('.price')?.textContent;
    const quantTexto = pizza.querySelector('.contador')?.textContent;

    if (!nome || !precoTexto || !quantTexto) return;

    const preco = parseFloat(precoTexto.replace('R$', '').trim());
    const quantidade = parseInt(quantTexto);

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


// =================== PAGAMENTO ===================

function configurarPagamento() {
  const radios = document.querySelectorAll('input[name="pagamento"]');
  const display = document.getElementById('pagamentoSelecionado');

  if (!display) return;

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      display.textContent = "Pagamento: " + radio.value;
    });
  });
}

function atualizarPagamentoSelecionado() {
  const selecionado = document.querySelector('input[name="pagamento"]:checked');
  const display = document.getElementById('pagamentoSelecionado');

  if (!display) return;

  display.textContent = selecionado ? "Pagamento: " + selecionado.value : "";
}


// =================== MODAL ===================

function abrirModal() {
  const modal = document.getElementById("minhaModal");
  if (modal) modal.style.display = "flex";

  atualizarRecibo();
  configurarPagamento();
  atualizarPagamentoSelecionado();
}

function fecharModal() {
  const modal = document.getElementById("minhaModal");
  if (modal) modal.style.display = "none";
}



// ================= FINALIZAR PEDIDO =================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnFinalizarPedido");

  if (!btn) return;

  btn.addEventListener("click", async () => {

    // --- VERIFICA LOGIN ---
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
      alert("Erro ao ler sessão. Faça login novamente.");
      window.location.href = "/html-css/pagina.login/login/index.html";
      return;
    }

    // --- PAGAMENTO ---
    const metodo = document.querySelector('input[name="pagamento"]:checked');
    if (!metodo) {
      alert("Selecione uma forma de pagamento!");
      return;
    }

    // --- ENDEREÇO ---
    const endereco = document.getElementById("enderecoComentario")?.value.trim() || "";
    if (!endereco) {
      if (!confirm("Endereço em branco. Deseja continuar mesmo assim?")) return;
    }

    // --- ITENS DO RECIBO ---
    const itens = [];

    document.querySelectorAll(".pizza").forEach(pizza => {
      const quantidade = parseInt(pizza.querySelector(".contador")?.textContent || "0");

      if (quantidade > 0) {
        itens.push({
          id: Number(pizza.dataset.id), // <-- sua página DEVE ter data-id
          quantidade,
          preco: Number(
            pizza.querySelector(".price")?.textContent.replace("R$", "").trim()
          )
        });
      }
    });

    if (itens.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    // --- PAYLOAD PARA O BACKEND ---
    const payload = {
      usuarioId: usuario.USUARIO_ID || usuario.id,
      formaPagamento: metodo.value,
      endereco,
      itens
    };

    try {
      console.log("PAYLOAD ENVIADO:", payload);

      const resp = await fetch("http://localhost:3000/pedido/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let dados = null;
      try {
        dados = await resp.json();
      } catch {
        dados = {};
      }

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
});
