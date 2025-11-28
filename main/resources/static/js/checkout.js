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
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-medium flex items-center gap-2">
                                <img src="https://api.iconify.design/lucide/user.svg" class="w-5 h-5" alt="Usuário"/>Dados Pessoais
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        id="full-name" 
                                        value="${user ? user.nome : ''}" 
                                        required 
                                        class="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">E-mail</label>
                                    <input 
                                        type="email" 
                                        value="${user ? user.email : ''}" 
                                        required 
                                        class="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Endereço -->
                    <div class="bg-white border border-gray-200 rounded-xl">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-medium flex items-center gap-2">
                                <img src="https://api.iconify.design/lucide/map-pin.svg" class="w-5 h-5" alt="Endereço"/>Endereço de Entrega
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Endereço Completo</label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    placeholder="Ex: Av. Julius Nyerere, nº 123, Maputo" 
                                    required 
                                    class="w-full border border-gray-300 rounded-lg p-2"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Pagamento com M-Pesa (WhatsApp) -->
                    <div class="bg-white border border-gray-200 rounded-xl">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-medium flex items-center gap-2">
                                <img src="https://api.iconify.design/lucide/message-circle.svg" class="w-5 h-5" alt="WhatsApp"/>Notificação por WhatsApp
                            </h3>
                        </div>
                        <div class="p-6">
                            <p class="text-sm text-gray-600 mb-4">
                                Insira seu número de telemóvel (ex: <strong>833340610</strong>). 
                                Enviaremos uma notificação detalhada de pagamento pelo WhatsApp.
                            </p>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-sm font-medium">Número de telemóvel</label>
                                    <input 
                                        type="tel" 
                                        id="mpesa-phone" 
                                        placeholder="833340610" 
                                        pattern="8[0-9]{8}" 
                                        maxlength="9"
                                        required 
                                        class="w-full border border-gray-300 rounded-lg p-2 mt-1"
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    id="send-mpesa-btn" 
                                    class="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg py-2.5 font-medium transition-colors"
                                >
                                    Enviar Notificação por WhatsApp
                                </button>
                                <div id="mpesa-message" class="hidden mt-3 p-3 rounded-lg text-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Resumo do Pedido -->
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
                        <button 
                            type="submit" 
                            id="confirm-order-btn"
                            disabled
                            class="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-semibold text-lg cursor-not-allowed"
                        >
                            Confirmar Pedido
                        </button>
                        <p class="text-xs text-center text-gray-500">🔒 Compra 100% segura</p>
                    </div>
                </div>
            </div>
        </form>
    `;

    let mpesaSent = false;

    document.getElementById('send-mpesa-btn').addEventListener('click', async () => {
        const phone = document.getElementById('mpesa-phone').value.trim();
        const fullName = document.getElementById('full-name').value.trim();
        const messageDiv = document.getElementById('mpesa-message');
        const confirmBtn = document.getElementById('confirm-order-btn');

        if (!/^[8][0-9]{8}$/.test(phone)) {
            messageDiv.className = 'mt-3 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200';
            messageDiv.textContent = 'Número inválido. Deve ter 9 dígitos começando com 8.';
            messageDiv.classList.remove('hidden');
            return;
        }

        if (!fullName) {
            messageDiv.className = 'mt-3 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200';
            messageDiv.textContent = 'Por favor, insira seu nome completo.';
            messageDiv.classList.remove('hidden');
            return;
        }

        // Prepara payload com dados detalhados
        const payload = {
            phone: phone,
            customerName: fullName,
            items: cartItems.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price * item.quantity
            })),
            total: total
        };

        try {
            const res = await fetch('/api/mpesa/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                messageDiv.className = 'mt-3 p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200';
                messageDiv.innerHTML = `
                    <strong>Sucesso!</strong> Notificação enviada para <strong>${phone}</strong>.<br>
                    Verifique seu WhatsApp.
                `;
                mpesaSent = true;
                confirmBtn.disabled = false;
                confirmBtn.className = 'w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg py-3 font-semibold text-lg transition-colors';
            } else {
                messageDiv.className = 'mt-3 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200';
                messageDiv.textContent = data.error || 'Erro ao enviar notificação.';
            }
        } catch (err) {
            messageDiv.className = 'mt-3 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200';
            messageDiv.textContent = 'Erro de conexão com o servidor.';
        }
        messageDiv.classList.remove('hidden');
    });

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!mpesaSent) {
            alert('Por favor, envie a notificação por WhatsApp antes de confirmar.');
            return;
        }

        container.innerHTML = `
            <div class="max-w-md w-full text-center mx-auto">
                <div class="bg-white border p-12 rounded-xl space-y-4">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src="https://api.iconify.design/lucide/check-circle-2.svg?color=%2316a34a" class="w-12 h-12" alt="Sucesso"/>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900">Pedido Confirmado!</h2>
                    <p class="text-gray-600">A notificação de pagamento foi enviada com sucesso pelo WhatsApp.</p>
                    <div class="pt-4">
                        <p class="text-sm text-gray-500">A redirecionar para o catálogo...</p>
                    </div>
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