// api.js - Objeto central para comunicação com o backend Spring Boot
// (Este objeto deve estar em outro arquivo: api.js)
// const api = { ... };

// Função de Navegação
const navigate = (page, params = {}) => {
    let url = `./${page}.html`; // ex: 'carrinho.html'
    if (Object.keys(params).length > 0) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }
    window.location.href = url;
};

// --- FUNÇÃO DE REGISTRO ---
const renderRegistroPage = () => {
    const container = document.getElementById('registro-container');
    if (!container) return;

    container.innerHTML = `
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-[#00BFA6] rounded-2xl mb-4">
                    <span class="text-white text-xl font-bold">LVI</span>
                </div>
                <h1 class="text-gray-900 text-2xl font-medium mb-2">Loja Virtual Inteligente</h1>
                <p class="text-gray-600">E-commerce Educativo</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-lg">
                <div class="p-6 sm:p-8">
                    <h2 class="text-center text-xl font-medium mb-2">Criar uma conta</h2>
                    <p class="text-center text-sm text-gray-500 mb-6">Preencha os dados abaixo</p>
                    <form id="registro-form" class="space-y-4">
                        <div class="space-y-2">
                            <label for="nome" class="text-sm font-medium text-gray-700">Nome Completo</label>
                            <div class="relative">
                                <img src="https://api.iconify.design/lucide/user.svg?color=%239ca3af" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" alt="Ícone de Usuário"/>
                                <input id="nome" type="text" placeholder="Seu nome" required class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#00BFA6] focus:border-[#00BFA6] outline-none transition-colors" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label for="email" class="text-sm font-medium text-gray-700">E-mail</label>
                            <div class="relative">
                                <img src="https://api.iconify.design/lucide/mail.svg?color=%239ca3af" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" alt="Ícone de Email"/>
                                <input id="email" type="email" placeholder="seu@email.com" required class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#00BFA6] focus:border-[#00BFA6] outline-none transition-colors" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label for="password" class="text-sm font-medium text-gray-700">Senha</label>
                            <div class="relative">
                                <img src="https://api.iconify.design/lucide/lock.svg?color=%239ca3af" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" alt="Ícone de Senha"/>
                                <input id="password" type="password" placeholder="••••••••" required class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#00BFA6] focus:border-[#00BFA6] outline-none transition-colors" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label for="tipoUsuario" class="text-sm font-medium text-gray-700">Tipo de Usuário</label>
                            <select id="tipoUsuario" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#00BFA6] focus:border-[#00BFA6] outline-none transition-colors">
                                <option value="">Selecione...</option>
                                <option value="CLIENTE">Cliente</option>
                                <option value="VENDEDOR">Vendedor</option>
                            </select>
                        </div>
                        <button type="submit" class="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg py-3 font-semibold transition-colors">Registrar</button>
                    </form>
                    <div class="mt-4 text-center text-sm">
                        <p>Já tem uma conta? <a href="login.html" class="text-[#00BFA6] font-medium hover:underline">Faça login</a></p>
                    </div>
                </div>
            </div>
            <div class="mt-6 text-center text-xs text-gray-500">
                <p>🔒 Sistema de autenticação com Hash Table</p>
            </div>
        </div>
    `;

    const registroForm = document.getElementById('registro-form');
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const tipoUsuario = document.getElementById('tipoUsuario').value;

        if (nome && email && password && tipoUsuario) {
            // Chama a API de registro
            const novoUsuario = await api.register(email, password, nome, tipoUsuario);
            if (novoUsuario) {
                alert('Registro realizado com sucesso! Você pode fazer login agora.');
                navigate('login');
            } else {
                alert('Falha no registro. O e-mail pode já estar em uso.');
            }
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
};

// --- FUNÇÃO DE DETALHES DO PRODUTO ---
const loadProductDetailPage = async () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // Obter o ID do produto da URL (ex: ?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        container.innerHTML = `<p class="text-center text-red-500">Produto não encontrado.</p>`;
        return;
    }

    // Carregar o produto
    const product = await api.getProductById(productId);

    if (!product) {
        container.innerHTML = `<p class="text-center text-red-500">Produto não encontrado.</p>`;
        return;
    }

    // Carregar recomendações
    const recommendedProducts = await api.getRecommendedProducts(productId);

    // Renderizar o conteúdo
    container.innerHTML = `
        <button onclick="navigate('index')" class="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg text-sm font-medium transition-colors">
            <img src="https://api.iconify.design/lucide/arrow-left.svg" class="w-4 h-4" alt="Voltar"/>
            Voltar ao Catálogo
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- Imagem do Produto -->
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full aspect-square object-cover" />
            </div>

            <!-- Info do Produto -->
            <div class="space-y-6">
                <div>
                    <span class="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-3">${product.category}</span>
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">${product.name}</h1>
                    <p class="text-gray-600 mb-4">${product.descricao || 'Sem descrição.'}</p>
                </div>

                <div class="border-t border-gray-200"></div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Preço</p>
                        <p class="text-2xl font-bold text-[#00BFA6]">MT ${(product.price || 0).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Estoque Disponível</p>
                        <p class="text-2xl font-bold">${product.estoque || 0} unidades</p>
                    </div>
                </div>

                <button id="add-to-cart-detail-btn" class="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg py-4 text-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                    <img src="https://api.iconify.design/lucide/shopping-cart.svg?color=white" class="w-5 h-5" alt="Carrinho"/>
                    Adicionar ao Carrinho
                </button>

                <div class="grid grid-cols-3 gap-4 pt-4">
                    <div class="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg">
                        <img src="https://api.iconify.design/lucide/package.svg?color=%2300bfa6" class="w-6 h-6 mb-2" alt="Produto Original"/>
                        <span class="text-xs text-gray-600">Produto Original</span>
                    </div>
                    <div class="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg">
                        <img src="https://api.iconify.design/lucide/truck.svg?color=%2300bfa6" class="w-6 h-6 mb-2" alt="Entrega Rápida"/>
                        <span class="text-xs text-gray-600">Entrega Rápida</span>
                    </div>
                    <div class="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg">
                        <img src="https://api.iconify.design/lucide/shield.svg?color=%2300bfa6" class="w-6 h-6 mb-2" alt="Compra Segura"/>
                        <span class="text-xs text-gray-600">Compra Segura</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Produtos Recomendados -->
        <div>
            <div class="flex items-center gap-3 mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Produtos Recomendados</h2>
                <span class="bg-[#00BFA6] text-white text-xs font-medium px-3 py-1 rounded-full">Grafo de Recomendações</span>
            </div>
            <div id="recommended-products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${recommendedProducts.length > 0
                    ? recommendedProducts.map(p => `
                        <div class="group overflow-hidden border border-gray-200 hover:border-[#00BFA6] transition-all duration-300 hover:shadow-lg cursor-pointer bg-white rounded-xl" onclick="navigate('produto', { id: '${p.id}' })">
                            <div class="relative overflow-hidden aspect-square bg-gray-50">
                                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div class="p-4">
                                <p class="text-sm text-gray-600 mb-1">${p.category}</p>
                                <h4 class="text-sm font-medium mb-2 line-clamp-2">${p.name}</h4>
                                <p class="font-bold text-[#00BFA6]">MT ${(p.price || 0).toFixed(2).replace('.', ',')}</p>
                            </div>
                        </div>
                      `).join('')
                    : '<p class="text-center text-gray-500">Nenhum produto recomendado no momento.</p>'
                }
            </div>
        </div>
    `;

    // Adiciona evento ao botão de adicionar ao carrinho
    document.getElementById('add-to-cart-detail-btn').addEventListener('click', () => {
        api.addToCart(product);
        alert(`"${product.name}" foi adicionado ao carrinho!`);
        renderHeader(); // Atualiza a contagem no cabeçalho
    });
};

// --- FUNÇÃO DE CARRINHO ---
const renderCart = (cartItems) => {
    console.log("🛒 renderCart chamada com:", cartItems); // <-- Novo log

    const container = document.getElementById('cart-container');
    if (!container) {
        console.error("Elemento #cart-container não encontrado!");
        return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    console.log("Total:", total, "Itens:", cartItemCount); // <-- Novo log

    let contentHTML = `
        <button onclick="navigate('index')" class="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg text-sm font-medium transition-colors">
            <img src="https://api.iconify.design/lucide/arrow-left.svg" class="w-4 h-4" alt="Voltar"/>
            Continuar Comprando
        </button>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>
    `;

    if (cartItems.length === 0) {
        contentHTML += contentHTML += `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Itens do Carrinho -->
        <div id="cart-items-list" class="lg:col-span-2 space-y-4">
            ${cartItems.map(item => `
                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden p-6">
                    <div class="flex gap-6">
                        <div class="w-32 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onclick="navigate('produto', { id: '${item.product.id || '0'}' })">
                            <img src="${item.product.image || 'https://via.placeholder.com/150'}" alt="${item.product.name || 'Produto sem nome'}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between gap-4 mb-2">
                                <div>
                                    <h3 class="font-medium text-gray-900 mb-1 cursor-pointer hover:text-[#00BFA6] transition-colors" onclick="navigate('produto', { id: '${item.product.id || '0'}' })">${item.product.name || 'Nome indisponível'}</h3>
                                    <p class="text-sm text-gray-500">${item.product.category || 'Sem categoria'}</p>
                                </div>
                                <button class="remove-item-btn p-2 rounded-lg hover:bg-red-50" data-product-id="${item.product.id || '0'}">
                                    <img src="https://api.iconify.design/lucide/trash-2.svg?color=%23ef4444" class="w-4 h-4" alt="Remover"/>
                                </button>
                            </div>
                            <div class="flex items-center justify-between mt-4">
                                <div class="flex items-center gap-2">
                                    <button class="quantity-btn border rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100" data-product-id="${item.product.id || '0'}" data-change="-1">-</button>
                                    <span class="w-12 text-center font-medium">${item.quantity}</span>
                                    <button class="quantity-btn border rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100" data-product-id="${item.product.id || '0'}" data-change="1">+</button>
                                </div>
                                <div class="text-right">
                                    <p class="text-[#00BFA6] font-bold text-lg">MT ${((item.product.price || 0) * item.quantity).toFixed(2).replace('.', ',')}</p>
                                    <p class="text-xs text-gray-500">MT ${(item.product.price || 0).toFixed(2).replace('.', ',')} cada</p>
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

    // Adiciona eventos para os botões de quantidade
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.productId;
            const change = parseInt(e.currentTarget.dataset.change, 10);
            const item = api.getCart().find(i => i.product.id === id);
            if (item) {
                const newQuantity = item.quantity + change;
                if (newQuantity > 0) {
                    api.updateCartItemQuantity(id, newQuantity);
                    loadCartPage(); // Recarrega a página de carrinho
                    renderHeader(); // Atualiza o header
                } else {
                    api.removeCartItem(id);
                    loadCartPage();
                    renderHeader();
                }
            }
        });
    });

    // Adiciona eventos para os botões de remoção
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

// --- FUNÇÃO DE CARRINHO ---
const loadCartPage = () => {
    console.log("🚀 loadCartPage chamada!"); // <-- ADICIONE ESTE LOG

    const container = document.getElementById('cart-container');
    if (!container) {
        console.error("Elemento #cart-container não encontrado!");
        return;
    }

    const cartItems = api.getCart();
    console.log("Itens do carrinho recebidos:", cartItems); // <-- Novo log
    renderCart(cartItems);
};

// Duplicate renderCart removed (original implementation is defined earlier)

// Renderização do Cabeçalho
const renderHeader = () => {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    const user = api.getCurrentUser();
    const cart = api.getCart();
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const headerHTML = `
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between gap-6">
                <!-- Logo -->
                <div class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onclick="navigate('index')">
                    <div class="w-10 h-10 bg-[#00BFA6] rounded-lg flex items-center justify-center">
                        <span class="text-white text-lg font-medium">LVI</span>
                    </div>
                    <div>
                        <h1 class="text-gray-900 font-medium">Loja Virtual Inteligente</h1>
                        <p class="text-xs text-gray-500">E-commerce Educativo</p>
                    </div>
                </div>

                <!-- Barra de Pesquisa -->
                <div class="flex-1 max-w-xl relative">
                    <img src="https://api.iconify.design/lucide/search.svg?color=%239ca3af" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" alt="Ícone de Pesquisa"/>
                    <input type="text" placeholder="Buscar produtos, cursos, materiais..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#00BFA6] focus:ring-1 focus:ring-[#00BFA6] outline-none transition-colors" />
                </div>

                <!-- Ações -->
                <div class="flex items-center gap-3">
                    ${user && user.isAdmin ? `<button onclick="navigate('admin')" class="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 text-sm font-medium transition-colors">
                        <img src="https://api.iconify.design/lucide/layout-dashboard.svg" class="w-4 h-4" alt="Painel"/> Admin
                    </button>` : ''}
                    
                    <button onclick="navigate('carrinho')" class="relative flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 text-sm font-medium transition-colors">
                        <img src="https://api.iconify.design/lucide/shopping-cart.svg" class="w-4 h-4" alt="Carrinho"/> Carrinho
                        ${cartItemCount > 0 ? `<span class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#00BFA6] text-white text-xs rounded-full font-bold">${cartItemCount}</span>` : ''}
                    </button>

                    ${user ? `<button id="logout-button" class="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 text-sm font-medium transition-colors">
                        <img src="https://api.iconify.design/lucide/user.svg" class="w-4 h-4" alt="Usuário"/> Sair
                    </button>` : `<button onclick="navigate('login')" class="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 text-sm font-medium transition-colors">
                        <img src="https://api.iconify.design/lucide/user.svg" class="w-4 h-4" alt="Usuário"/> Login
                    </button>`}
                </div>
            </div>
        </div>
    `;
    headerContainer.innerHTML = headerHTML;

    // Adicionar evento de logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            api.logout();
            navigate('login');
        });
    }
};

// Renderização do Rodapé
const renderFooter = () => {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <div class="container mx-auto px-6 py-8">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 class="text-gray-900 font-medium mb-1 text-center md:text-left">Loja Virtual Inteligente</h3>
                    <p class="text-sm text-gray-500 text-center md:text-left">Projeto acadêmico - Estrutura de Dados e Algoritmos</p>
                </div>
                <div class="text-sm text-gray-500 mt-4 md:mt-0">© 2025 Todos os direitos reservados</div>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-400 text-center">
                <p>Sistema demonstrativo utilizando: Hash Table (Login) • Árvore AVL (Catálogo) • Fila (Pedidos) • Grafo (Recomendações)</p>
            </div>
        </div>
    `;
};

// Renderização da Página de Login
const renderLoginPage = () => {
    const container = document.getElementById('login-container');
    if (!container) return;

    container.innerHTML = `
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-[#00BFA6] rounded-2xl mb-4">
                    <span class="text-white text-xl font-bold">LVI</span>
                </div>
                <h1 class="text-gray-900 text-2xl font-medium mb-2">Loja Virtual Inteligente</h1>
                <p class="text-gray-600">E-commerce Educativo</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-lg">
                <div class="p-6 sm:p-8">
                    <h2 class="text-center text-xl font-medium mb-2">Entrar na sua conta</h2>
                    <p class="text-center text-sm text-gray-500 mb-6">Insira seus dados para continuar</p>
                    <form id="login-form" class="space-y-4">
                        <div class="space-y-2">
                            <label for="email" class="text-sm font-medium text-gray-700">E-mail</label>
                            <div class="relative">
                                <img src="https://api.iconify.design/lucide/mail.svg?color=%239ca3af" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" alt="Ícone de Email"/>
                                <input id="email" type="email" placeholder="seu@email.com" required class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#00BFA6] focus:border-[#00BFA6] outline-none transition-colors" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label for="password" class="text-sm font-medium text-gray-700">Senha</label>
                            <div class="relative">
                                <img src="https://api.iconify.design/lucide/lock.svg?color=%239ca3af" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" alt="Ícone de Senha"/>
                                <input id="password" type="password" placeholder="••••••••" required class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#00BFA6] focus:border-[#00BFA6] outline-none transition-colors" />
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg py-3 font-semibold transition-colors">Entrar</button>
                    </form>
                    <!-- Novo: Link para registro -->
                    <div class="mt-4 text-center text-sm">
                        <p>Não tem uma conta? <a href="#" onclick="navigate('registro')" class="text-[#00BFA6] font-medium hover:underline">Registre-se aqui</a></p>
                    </div>
                    <!-- Fim do Novo -->
                    <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p class="text-xs text-blue-900">💡 <strong>Dica:</strong> Use "admin@email.com" para aceder ao painel administrativo.</p>
                    </div>
                </div>
            </div>
            <div class="mt-6 text-center text-xs text-gray-500">
                <p>🔒 Sistema de autenticação com Hash Table</p>
            </div>
        </div>
    `;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            const user = await api.login(email, password);
            if (user) {
                // Redireciona com base no tipo de usuário
                if (user.tipoUsuario === 'ADMIN') {
                    navigate('admin');
                } else if (user.tipoUsuario === 'VENDEDOR') {
                    // navigate('vendedor'); // Implementar página vendedor se necessário
                    alert('Bem-vindo vendedor! (Redirecionando para catálogo por enquanto)');
                    navigate('index');
                } else { // CLIENTE
                    navigate('index');
                }
            } else {
                alert('Falha no login. Verifique suas credenciais.');
            }
        } else {
            alert('Por favor, insira e-mail e senha.');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário está logado
    const user = api.getCurrentUser();
    const path = window.location.pathname.split("/").pop();

    // Se NÃO estiver logado e NÃO estiver na página de login ou registro → redireciona para login
    if (!user && path !== 'login.html' && path !== 'login' && path !== 'registro.html' && path !== 'registro') {
        console.log("Usuário não logado. Redirecionando para login...");
        navigate('login');
        return;
    }

    // Se estiver logado, mas tentar acessar login ou registro → redireciona para index
    if (user && (path === 'login.html' || path === 'login' || path === 'registro.html' || path === 'registro')) {
        console.log("Usuário já logado. Redirecionando para catálogo...");
        navigate('index');
        return;
    }

    // Carrega componentes globais (header e footer)
    renderHeader();
    renderFooter();

    // Roteamento baseado na página atual
    if (path === 'index.html' || path === '') {
        loadCatalogPage();
    } else if (path === 'produto.html') {
        loadProductDetailPage();
    } else if (path === 'carrinho.html') {
        loadCartPage();
    } else if (path === 'checkout.html') {
        loadCheckoutPage();
    } else if (path === 'admin.html') {
        if (!user || user.tipoUsuario !== 'ADMIN') {
            alert('Acesso negado. Apenas administradores.');
            navigate('index');
            return;
        }
        loadAdminPage();
    } else if (path === 'login.html' || path === 'login') {
        renderLoginPage();
    } else if (path === 'registro.html' || path === 'registro') {
        renderRegistroPage();
    }
});