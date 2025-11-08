const loadAdminPage = async () => {
    const user = api.getCurrentUser();
    if (!user || !user.isAdmin) {
        alert('Acesso negado. Apenas administradores.');
        navigate('index');
        return;
    }

    const container = document.getElementById('admin-page-container');
    if (!container) return;

    const products = await api.getProducts();
    const orders = await api.getOrders();

    const stats = {
        totalProducts: products.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
        totalUsers: 156, // Mock data
    };

    container.innerHTML = `
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <button onclick="navigate('index')" class="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg text-sm font-medium transition-colors">
                            <img src="https://api.iconify.design/lucide/arrow-left.svg" class="w-4 h-4" alt="Voltar"/> Voltar à Loja
                        </button>
                        <div class="h-8 w-px bg-gray-200"></div>
                        <h1 class="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                    </div>
                    <button id="admin-logout-button" class="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg text-sm font-medium transition-colors">Sair</button>
                </div>
            </div>
        </header>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-6">
                <nav id="admin-nav" class="space-y-2">
                    <button data-tab="products" class="admin-nav-btn active">
                        <img src="https://api.iconify.design/lucide/package.svg" class="w-5 h-5" alt="Produtos"/><span>Produtos</span>
                    </button>
                    <button data-tab="orders" class="admin-nav-btn">
                        <img src="https://api.iconify.design/lucide/shopping-bag.svg" class="w-5 h-5" alt="Pedidos"/><span>Pedidos</span>
                    </button>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <!-- Stats -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white border rounded-xl p-6"><p class="text-sm text-gray-500 mb-1">Total de Produtos</p><p class="text-3xl font-bold">${stats.totalProducts}</p></div>
                    <div class="bg-white border rounded-xl p-6"><p class="text-sm text-gray-500 mb-1">Pedidos Pendentes</p><p class="text-3xl font-bold">${stats.pendingOrders}</p></div>
                    <div class="bg-white border rounded-xl p-6"><p class="text-sm text-gray-500 mb-1">Receita Total</p><p class="text-3xl font-bold">MT ${(stats.totalRevenue / 1000).toFixed(1)}k</p></div>
                    <div class="bg-white border rounded-xl p-6"><p class="text-sm text-gray-500 mb-1">Total de Utilizadores</p><p class="text-3xl font-bold">${stats.totalUsers}</p></div>
                </div>

                <!-- Tabs Content -->
                <div id="admin-content"></div>
                 <div class="mt-6 bg-white border rounded-xl p-6">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><span class="text-xl">⚡</span></div>
                        <div>
                            <h3 class="text-gray-900 font-medium mb-2">Estruturas de Dados em Ação</h3>
                            <p class="text-gray-600 text-sm"><strong>Fila:</strong> Os pedidos são processados em ordem de chegada utilizando uma estrutura de Fila (FIFO), garantindo que todos sejam atendidos sequencialmente.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    // Lógica das abas
    const adminContent = document.getElementById('admin-content');
    const navButtons = document.querySelectorAll('.admin-nav-btn');

    const renderTabContent = (tab) => {
        navButtons.forEach(b => b.classList.remove('active'));
        document.querySelector(`.admin-nav-btn[data-tab=${tab}]`).classList.add('active');

        if (tab === 'products') {
            adminContent.innerHTML = renderProductsTable(products);
        } else if (tab === 'orders') {
            adminContent.innerHTML = renderOrdersTable(orders);
        }
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => renderTabContent(e.currentTarget.dataset.tab));
    });
    
    // Renderiza a primeira aba por defeito
    renderTabContent('products');

    document.getElementById('admin-logout-button').addEventListener('click', () => {
        api.logout();
        navigate('login');
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .admin-nav-btn { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem; transition: background-color 0.2s; text-align: left; font-weight: 500; }
        .admin-nav-btn:hover { background-color: #f3f4f6; }
        .admin-nav-btn.active { background-color: #00BFA6; color: white; }
        .admin-nav-btn.active img { filter: brightness(0) invert(1); }
        th { padding: 12px 16px; text-align: left; font-weight: 500; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        td { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
    `;
    document.head.appendChild(style);
};

const renderProductsTable = (products) => `
    <div class="bg-white border rounded-xl">
        <div class="p-6 flex justify-between items-center"><h2 class="text-xl font-bold">Gerir Produtos</h2><button class="bg-[#00BFA6] text-white px-4 py-2 rounded-lg font-semibold">Adicionar Produto</button></div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead><tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Ações</th></tr></thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>#${p.id}</td>
                            <td>${p.name}</td>
                            <td><span class="bg-gray-100 text-xs px-2 py-1 rounded-full">${p.category}</span></td>
                            <td class="text-[#00BFA6] font-semibold">MT ${p.price.toFixed(2).replace('.', ',')}</td>
                            <td><button class="p-2 hover:bg-gray-100 rounded-lg"><img src="https://api.iconify.design/lucide/edit.svg" class="w-4 h-4" alt="Editar"/></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
`;

const renderOrdersTable = (orders) => {
    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-600 border-yellow-200',
            processing: 'bg-blue-100 text-blue-600 border-blue-200',
            completed: 'bg-green-100 text-green-600 border-green-200'
        };
        const text = {
            pending: 'Pendente',
            processing: 'Processando',
            completed: 'Concluído'
        }
        return `<span class="text-xs px-2 py-1 rounded-full border ${styles[status]}">${text[status]}</span>`;
    };
    return `
        <div class="bg-white border rounded-xl">
            <div class="p-6"><h2 class="text-xl font-bold">Gerir Pedidos</h2></div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>
                        ${orders.map(o => `
                            <tr>
                                <td>${o.id}</td>
                                <td>${o.userId}</td>
                                <td>${new Date(o.date).toLocaleDateString('pt-BR')}</td>
                                <td class="text-[#00BFA6] font-semibold">MT ${o.total.toFixed(2).replace('.', ',')}</td>
                                <td>${getStatusBadge(o.status)}</td>
                                <td><button class="p-2 hover:bg-gray-100 rounded-lg"><img src="https://api.iconify.design/lucide/edit.svg" class="w-4 h-4" alt="Editar"/></button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};