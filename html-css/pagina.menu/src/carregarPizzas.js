async function carregarPizzas() {
    const resposta = await fetch("http://localhost:3000/pizza/listar");
    const pizzas = await resposta.json();
    const container = document.querySelector("#listaPizzas");
    container.innerHTML = "";

    pizzas.forEach(pizza => {
        container.innerHTML += `
        <div class="pizza" 
             data-id="${pizza.PIZZA_ID}" 
             data-preco="${pizza.PRECO}">
             
            <img src="http://localhost:3000/uploads/${pizza.IMAGEM_URL}" 
                 class="ImagensP" 
                 alt="${pizza.PIZZA}">
            
            <h2>${pizza.PIZZA}</h2>
            <p>${pizza.INGREDIENTES}</p>
            <span class="price">R$ ${pizza.PRECO.toFixed(2)}</span>

            <div class="acoes">
                <button class="botao">
                    <i class="fa-solid fa-basket-shopping"></i>
                </button>

                <div class="contador-container">
                    <button class="diminuir">−</button>
                    <span class="contador">0</span>
                </div>
            </div>
        </div>`;
    });

    const pizzasCards = document.querySelectorAll(".pizza");

    pizzasCards.forEach(card => {
        const botao = card.querySelector(".botao");
        const diminuir = card.querySelector(".diminuir");
        const contador = card.querySelector(".contador");

        // 🔥 valor REAL sincronizado com DOM
        let valor = Number(contador.textContent);

        botao.addEventListener("click", () => {
            valor++;
            contador.textContent = valor;
            contador.classList.add("ativo");
        });

        diminuir.addEventListener("click", () => {
            if (valor > 0) {
                valor--;
                contador.textContent = valor;
            }
            if (valor === 0) {
                contador.classList.remove("ativo");
            }
        });
    });
}

// executa ao abrir a página
carregarPizzas();
