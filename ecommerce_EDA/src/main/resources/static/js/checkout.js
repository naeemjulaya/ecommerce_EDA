const loadCheckoutPage = () => {
    const container = document.getElementById('checkout-container');
    if (!container) return;
    
    const cartItems = api.getCart();
    if (cartItems.length === 0) {
        navigate('carrinho');
        return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const user = api.getCurrentUser();

    container.innerHTML = `
        <button onclick="navigate('carrinho')" class="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg text-sm font-medium transition-colors">
            <img src="https://api.iconify.design/lucide/arrow-left.svg" class="w-4 h-4" alt="Voltar"/>
            Voltar ao Carrinho
        </button>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>
        <form id="checkout-form">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Formulário -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Dados Pessoais -->
                    <div class="bg-white border border-gray-200 rounded-xl">
                        <div class="p-6 border-b"><h3 class="text-lg font-medium flex items-center gap-2"><img src="https://api.iconify.design/lucide/user.svg" class="w-5 h-5" alt="Usuário"/>Dados Pessoais</h3></div>
                        <div class="p-6 space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2"><label class="text-sm font-medium">Nome Completo</label><input type="text" required class="w-full border border-gray-300 rounded-lg p-2"/></div>
                                <div class="space-y-2"><label class="text-sm font-medium">E-mail</label><input type="email" value="${user ? user.email : ''}" required class="w-full border border-gray-300 rounded-lg p-2"/></div>
                            </div>
                        </div>
                    </div>
                    <!-- Endereço -->
                    <div class="bg-white border border-gray-200 rounded-xl">
                         <div class="p-6 border-b"><h3 class="text-lg font-medium flex items-center gap-2"><img src="https://api.iconify.design/lucide/map-pin.svg" class="w-5 h-5" alt="Endereço"/>Endereço de Entrega</h3></div>
                        <div class="p-6 space-y-4">
                            <div class="space-y-2"><label class="text-sm font-medium">Endereço</label><input type="text" required class="w-full border border-gray-300 rounded-lg p-2"/></div>
                        </div>
                    </div>
                    <!-- Pagamento -->
                    <div class="bg-white border border-gray-200 rounded-xl">
                        <div class="p-6 border-b"><h3 class="text-lg font-medium flex items-center gap-2"><img src="https://api.iconify.design/lucide/credit-card.svg" class="w-5 h-5" alt="Pagamento"/>Pagamento</h3></div>
                        <div class="p-6"><p>Pagamento na entrega.</p></div>
                    </div>
                </div>
                <!-- Resumo -->
                <div class="lg:col-span-1">
                    <div class="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                        <h3 class="text-xl font-medium text-gray-900">Resumo do Pedido</h3>
                        <div class="border-t border-gray-200"></div>
                        <div class="space-y-3">
                            ${cartItems.map(item => `
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">${item.quantity}x ${item.product.name}</span>
                                    <span class="text-gray-900 font-medium">MT ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="border-t border-gray-200"></div>
                        <div class="flex justify-between">
                            <span class="text-lg font-bold text-gray-900">Total</span>
                            <span class="text-xl font-bold text-[#00BFA6]">MT ${total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button type="submit" class="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg py-3 font-semibold text-lg transition-colors">Confirmar Pedido</button>
                    </div>
                </div>
            </div>
        </form>
    `;

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        container.innerHTML = `
            <div class="max-w-md w-full text-center mx-auto">
                <div class="bg-white border p-12 rounded-xl space-y-4">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src="https://api.iconify.design/lucide/check-circle-2.svg?color=%2316a34a" class="w-12 h-12" alt="Sucesso"/>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900">Pedido Confirmado!</h2>
                    <p class="text-gray-600">O seu pedido foi processado com sucesso. Você receberá um e-mail com os detalhes.</p>
                    <div class="pt-4"><p class="text-sm text-gray-500">A redirecionar para o catálogo...</p></div>
                </div>
            </div>
        `;

        api.clearCart();
        renderHeader();
        setTimeout(() => {
            navigate('index');
        }, 3000);
    });
}; 