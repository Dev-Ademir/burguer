const list = document.querySelector("ul");
const menuBtn = document.querySelector(".menu");
const promBtn = document.querySelector(".prom-map");
const totalBtn = document.querySelector(".total");

// Botões de filtro
const filtroVeganoBtn = document.querySelector(".filtro-vegano");
const filtroAveBtn = document.querySelector(".filtro-ave");
const filtroCarneBtn = document.querySelector(".filtro-carne");

// Carrinho
let carrinho = [];

// Elementos do carrinho
const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const cartCountSpan = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");

// Variável para armazenar os produtos atuais
let produtosAtuais = [...menuOptions];

function renderMenu(produtos) {
    let myli = ""; 
    
    produtos.forEach((produto) => { 
        const precoFormatado = produto.preço.toFixed(2).replace('.', ',');
        
        myli += `
        <li class="item"
            data-nome="${produto.nome}"
            data-preço="${produto.preço}">
            <img src="${produto.src}" alt="${produto.nome}">
            <p class="nome">${produto.nome}</p>
            <p class="preço">R$ ${precoFormatado}</p>
            <button class="add-to-cart" data-nome="${produto.nome}" data-preco="${produto.preço}">
                🛒 Adicionar ao Carrinho
            </button>
        </li>`;
    });
    list.innerHTML = myli;
    produtosAtuais = [...produtos];
    
    // Adicionar eventos aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nome = btn.getAttribute('data-nome');
            const preco = parseFloat(btn.getAttribute('data-preco'));
            adicionarAoCarrinho(nome, preco);
        });
    });
}

function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade++;
        itemExistente.total = itemExistente.quantidade * itemExistente.preco;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1,
            total: preco
        });
    }
    
    atualizarCarrinho();
    mostrarNotificacao(`${nome} adicionado ao carrinho!`);
}

function removerDoCarrinho(index) {
    const itemRemovido = carrinho[index];
    carrinho.splice(index, 1);
    atualizarCarrinho();
    mostrarNotificacao(`${itemRemovido.nome} removido do carrinho!`);
}

function atualizarCarrinho() {
    // Atualizar contador
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    cartCountSpan.textContent = totalItens;
    
    // Atualizar lista do carrinho
    if (carrinho.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; padding: 20px;">Seu carrinho está vazio 🛒</p>';
        cartTotalSpan.textContent = 'R$ 0,00';
        return;
    }
    
    let html = '';
    let totalGeral = 0;
    
    carrinho.forEach((item, index) => {
        const totalItem = item.total;
        totalGeral += totalItem;
        
        html += `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')} x ${item.quantidade}</div>
                <div><strong>Subtotal: R$ ${totalItem.toFixed(2).replace('.', ',')}</strong></div>
            </div>
            <button class="cart-item-remove" data-index="${index}">❌ Remover</button>
        </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    cartTotalSpan.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    
    // Adicionar eventos aos botões de remover
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            removerDoCarrinho(index);
        });
    });
}

function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #79cb15;
        color: black;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.remove();
    }, 2000);
}

function limparCarrinho() {
    if (carrinho.length > 0 && confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        carrinho = [];
        atualizarCarrinho();
        mostrarNotificacao('Carrinho limpo com sucesso!');
    }
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('❌ Seu carrinho está vazio! Adicione alguns itens primeiro.');
        return;
    }
    
    // Construir resumo do pedido
    let resumoItens = '';
    let totalGeral = 0;
    
    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
        resumoItens += `${index + 1}º) ${item.nome} - ${item.quantidade}x R$ ${item.preco.toFixed(2).replace('.', ',')} = R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });
    
    const mensagem = 
        `🛒 CONFIRMAÇÃO DO PEDIDO 🛒\n\n` +
        `📋 ITENS:\n${resumoItens}\n` +
        `─────────────────────\n` +
        `💰 TOTAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}\n\n` +
        `✅ Confirmar pedido?\n` +
        `❌ Cancelar para voltar ao carrinho.`;
    
    const confirmacao = confirm(mensagem);
    
    if (confirmacao) {
        alert(
            `🎉 PEDIDO REALIZADO COM SUCESSO! 🎉\n\n` +
            `Seu pedido foi enviado para a cozinha.\n` +
            `Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}\n` +
            `Itens: ${carrinho.length} produto(s) diferentes\n\n` +
            `⏱️ Tempo estimado: 30-40 minutos\n` +
            `Obrigado pela preferência! 🍔`
        );
        
        carrinho = [];
        atualizarCarrinho();
        cartModal.style.display = 'none';
        mostrarNotificacao('✅ Pedido finalizado! Obrigado pela compra!');
    }
}

function applyProm() {
    const preçoPromoção = menuOptions.map((produtoPromo) => ({
        ...produtoPromo,
        preço: Number((produtoPromo.preço * 0.9).toFixed(2))
    }));
    renderMenu(preçoPromoção);
}

// NOVA FUNÇÃO mostrarTotal - substituída pela versão com carrinho
function mostrarTotal() {
    if (carrinho.length === 0) {
        alert('🛒 Seu carrinho está vazio!\n\nAdicione alguns itens primeiro clicando em "Adicionar ao Carrinho" em cada produto.');
        return;
    }
    
    // Calcula total geral e quantidade total de itens
    const totalGeral = carrinho.reduce((acc, item) => acc + item.total, 0);
    const quantidadeTotal = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const produtosDiferentes = carrinho.length;
    
    // Construir resumo detalhado
    let resumoItens = '';
    carrinho.forEach((item, index) => {
        resumoItens += `${index + 1}º) ${item.nome} - ${item.quantidade}x R$ ${item.preco.toFixed(2).replace('.', ',')} = R$ ${item.total.toFixed(2).replace('.', ',')}\n`;
    });
    
    const mensagem = 
        `🛒 RESUMO DO SEU CARRINHO 🛒\n\n` +
        `📋 ITENS ADICIONADOS:\n${resumoItens}\n` +
        `─────────────────────\n` +
        `📦 Total de itens: ${quantidadeTotal} produto(s)\n` +
        `🍔 Produtos diferentes: ${produtosDiferentes}\n` +
        `💰 VALOR TOTAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}\n\n` +
        `✅ Deseja visualizar o carrinho completo para finalizar a compra?`;
    
    if (confirm(mensagem)) {
        cartModal.style.display = 'flex';
    }
}

function filtrarVegano() {
    const filtrados = menuOptions.filter((produto) => produto.vegano === true);
    renderMenu(filtrados);
}

function filtrarAve() {
    const filtrados = menuOptions.filter((produto) => produto.ave === true);
    renderMenu(filtrados);
}

function filtrarCarne() {
    const filtrados = menuOptions.filter((produto) => produto.vegano === false && produto.ave === false);
    renderMenu(filtrados);
}

// Eventos do Carrinho
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

clearCartBtn.addEventListener('click', limparCarrinho);
checkoutBtn.addEventListener('click', finalizarPedido);

// Eventos principais
menuBtn.addEventListener("click", () => renderMenu(menuOptions));
promBtn.addEventListener("click", applyProm);
totalBtn.addEventListener("click", mostrarTotal);
filtroVeganoBtn.addEventListener("click", filtrarVegano);
filtroAveBtn.addEventListener("click", filtrarAve);
filtroCarneBtn.addEventListener("click", filtrarCarne);

// Renderizar menu inicial
renderMenu(menuOptions);