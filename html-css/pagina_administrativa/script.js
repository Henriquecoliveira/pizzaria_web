// ============================================================
// === FUNÇÕES DE MODAL (abrir/fechar) ===
// ============================================================
function abrirModal(id) {
    document.getElementById(id).style.display = "flex";
}

function fecharModal(id) {
    document.getElementById(id).style.display = "none";
}

// fechar modais clicando fora
window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
});

// botões de fechar (X)
document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", () => {
        fecharModal(btn.dataset.close);
    });
});

// botões de abrir modais (adicionar/remover pizza)
document.getElementById("btn-add").addEventListener("click", () => {
    abrirModal("modalAdd");
});

document.getElementById("btn-remove").addEventListener("click", () => {
    abrirModal("modalRemove");
});


// ============================================================
// === RELATÓRIO DO DIA ===
// ============================================================
document.getElementById("btn-dia").addEventListener("click", () => {
    abrirModal("modalDia");
    carregarRelatorioDia();
});

async function carregarRelatorioDia() {
    const tabela = document.getElementById("tabelaDiaBody");
    tabela.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

    try {
        const res = await fetch("http://localhost:3000/relatorio/dia");
        const dados = await res.json();

        if (!dados.length) {
            tabela.innerHTML = "<tr><td colspan='6'>Nenhum pedido hoje.</td></tr>";
            return;
        }

        tabela.innerHTML = dados.map(item => `
            <tr>
                <td>${item.PEDIDO_ID}</td>
                <td>${item.USUARIO_ID}</td>
                <td>${item.DATA_HORA_PEDIDO}</td>
                <td>${item.ENDERECO}</td>
                <td>${item.FORMA_DE_PAGAMENTO}</td>
                <td>${item.ALIMENTO}</td>
            </tr>
        `).join("");

    } catch (err) {
        tabela.innerHTML = "<tr><td colspan='6'>Erro ao carregar relatório.</td></tr>";
    }
}


// ============================================================
// === RELATÓRIO DO MÊS ===
// ============================================================
document.getElementById("btn-mes").addEventListener("click", () => {
    abrirModal("modalMes");
    carregarRelatorioMes();
});

document.getElementById("mesSelect").addEventListener("change", () => {
    carregarRelatorioMes();
});

async function carregarRelatorioMes() {
    const mes = document.getElementById("mesSelect").value;
    const tabela = document.getElementById("tabelaMesBody");

    tabela.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

    try {
        const res = await fetch(`http://localhost:3000/relatorio/mes/${mes}`);
        const dados = await res.json();

        if (!dados.length) {
            tabela.innerHTML = "<tr><td colspan='6'>Nenhum pedido neste mês.</td></tr>";
            return;
        }

        tabela.innerHTML = dados.map(item => `
            <tr>
                <td>${item.PEDIDO_ID}</td>
                <td>${item.USUARIO_ID}</td>
                <td>${item.DATA_HORA_PEDIDO}</td>
                <td>${item.ENDERECO}</td>
                <td>${item.FORMA_DE_PAGAMENTO}</td>
                <td>${item.ALIMENTO}</td>
            </tr>
        `).join("");

    } catch (err) {
        tabela.innerHTML = "<tr><td colspan='6'>Erro ao carregar relatório.</td></tr>";
    }
}


// ============================================================
// === CADASTRAR PIZZA ===
// ============================================================
document.getElementById("pizzaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const res = await fetch("http://localhost:3000/pizza", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        alert(data.message || data.error);

        // limpa o formulário após salvar
        if (data.message) e.target.reset();

    } catch (error) {
        alert("Erro ao cadastrar pizza.");
    }
});


// ============================================================
// === REMOVER PIZZA ===
// ============================================================
document.getElementById("formRemove").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("pizzaId").value;
    const nome = document.getElementById("pizzaNome").value;

    try {
        const resp = await fetch("http://localhost:3000/pizza", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, nome })
        });

        const result = await resp.json();
        alert(result.message || result.error);

        e.target.reset();

    } catch (error) {
        alert("Erro ao remover pizza.");
    }
});
