document.addEventListener('DOMContentLoaded', () => {
    // Carrega componentes globais
    renderHeader();
    renderFooter();

    // Roteamento simples baseado no nome do ficheiro
    const path = window.location.pathname.split("/").pop();

    if (path === 'login.html') {
        renderLoginPage();
    } else if (path === 'index.html' || path === '') {
        loadCatalogPage();
    } else if (path === 'produto.html') {
        loadProductDetailPage();
    } else if (path === 'carrinho.html') {
        loadCartPage();
    } else if (path === 'checkout.html') {
        loadCheckoutPage();
    } else if (path === 'admin.html') {
        loadAdminPage();
    }
});

// Função de Navegação
const navigate = (page, params = {}) => {
    let url = `./${page}.html`;
    if (Object.keys(params).length > 0) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }
    window.location.href = url;
};

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
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (email) {
            api.login(email);
            alert('Login realizado com sucesso!');
            navigate('index');
        } else {
            alert('Por favor, insira um e-mail.');
        }
    });
};