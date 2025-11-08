const loadCartPage = () => {
    const container = document.getElementById('cart-container');
    if (!container) return;
    
    const cartItems = api.getCart();
    renderCart(cartItems);
};

const renderCart = (cartItems) => {
    const container = document.getElementById('cart-container');
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    let contentHTML = `
        <button onclick="navigate('index')" class="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg text-sm font-medium transition-colors">
            <img src="https://api.iconify.design/lucide/arrow-left.svg" class="w-4 h-4" alt="Voltar"/>
            Continuar Comprando
        </button>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>
    `;

    if (cartItems.length === 0) {
        contentHTML += `
            <div class="text-center py-12 bg-white border border-gray-200 rounded-xl">
                <div class="space-y-4">
                    <img src="https://api.iconify.design/lucide/shopping-bag.svg?color=%23d1d5db" class="w-16 h-16 mx-auto" alt="Carrinho Vazio"/>
                    <div>
                        <h3 class="text-xl font-medium text-gray-900 mb-2">Seu carrinho está vazio</h3>
                        <p class="text-gray-600">Adicione produtos ao carrinho para continuar.</p>
                    </div>
                    <button onclick="navigate('index')" class="bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg px-6 py-3 font-semibold transition-colors">Ver Produtos</button>
                </div>
            </div>
        `;
    } else {
        contentHTML += `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Itens do Carrinho -->
                <div id="cart-items-list" class="lg:col-span-2 space-y-4">
                    ${cartItems.map(item => `
                        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden p-6">
                            <div class="flex gap-6">
                                <div class="w-32 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onclick="navigate('produto', { id: '${item.product.id}' })">
                                    <img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between gap-4 mb-2">
                                        <div>
                                            <h3 class="font-medium text-gray-900 mb-1 cursor-pointer hover:text-[#00BFA6] transition-colors" onclick="navigate('produto', { id: '${item.product.id}' })">${item.product.name}</h3>
                                            <p class="text-sm text-gray-500">${item.product.category}</p>
                                        </div>
                                        <button class="remove-item-btn p-2 rounded-lg hover:bg-red-50" data-product-id="${item.product.id}">
                                            <img src="https://api.iconify.design/lucide/trash-2.svg?color=%23ef4444" class="w-4 h-4" alt="Remover"/>
                                        </button>
                                    </div>
                                    <div class="flex items-center justify-between mt-4">
                                        <div class="flex items-center gap-2">
                                            <button class="quantity-btn border rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100" data-product-id="${item.product.id}" data-change="-1">-</button>
                                            <span class="w-12 text-center font-medium">${item.quantity}</span>
                                            <button class="quantity-btn border rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100" data-product-id="${item.product.id}" data-change="1">+</button>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-[#00BFA6] font-bold text-lg">MT ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                            <p class="text-xs text-gray-500">MT ${item.product.price.toFixed(2).replace('.', ',')} cada</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <!-- Resumo do Pedido -->
                <div class="lg:col-span-1">
                    <div class="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                        <h3 class="text-xl font-medium text-gray-900">Resumo do Pedido</h3>
                        <div class="border-t border-gray-200"></div>
                        <div class="space-y-2">
                            <div class="flex justify-between text-gray-600">
                                <span>Subtotal (${cartItemCount} ${cartItemCount === 1 ? 'item' : 'itens'})</span>
                                <span>MT ${total.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Frete</span>
                                <span class="text-[#00BFA6] font-medium">Grátis</span>
                            </div>
                        </div>
                        <div class="border-t border-gray-200"></div>
                        <div class="flex justify-between">
                            <span class="text-lg font-bold text-gray-900">Total</span>
                            <span class="text-xl font-bold text-[#00BFA6]">MT ${total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button onclick="navigate('checkout')" class="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg py-3 font-semibold text-lg transition-colors">Finalizar Pedido</button>
                        <p class="text-xs text-center text-gray-500">🔒 Compra 100% segura</p>
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = contentHTML;

    // Adiciona eventos para os botões
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.productId;
            const change = parseInt(e.currentTarget.dataset.change, 10);
            const item = api.getCart().find(i => i.product.id === id);
            if (item) {
                const newQuantity = item.quantity + change;
                api.updateCartItemQuantity(id, newQuantity);
                loadCartPage();
                renderHeader();
            }
        });
    });

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.productId;
            if (confirm('Tem certeza que deseja remover este item?')) {
                api.removeCartItem(id);
                loadCartPage();
                renderHeader();
            }
        });
    });
};