const loadCatalogPage = async () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '<p>A carregar produtos...</p>'; // Feedback visual

    const products = await api.getProducts();
    renderProducts(products);

    const categories = [...new Set(products.map(p => p.category))];
    renderCategoryFilters(categories);
};

const renderProducts = (products) => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = ''; // Limpa a grelha

    if (products.length === 0) {
        grid.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = "group flex flex-col overflow-hidden border border-gray-200 hover:border-[#00BFA6] transition-all duration-300 hover:shadow-lg bg-white rounded-xl";
        // Dentro do loop products.forEach(...)
    card.innerHTML = `
    <div class="relative overflow-hidden aspect-square bg-gray-50 cursor-pointer" onclick="navigate('produto', { id: '${product.id}' })">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ${product.recommended ? `<span class="absolute top-3 right-3 bg-[#00BFA6] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
            <img src="https://api.iconify.design/lucide/star.svg?color=white" class="w-3 h-3" alt="Recomendado"/> Recomendado
        </span>` : ''}
    </div>
    <div class="p-5 flex-1 flex flex-col">
        <div class="mb-2 text-xs text-gray-500">${product.category}</div>
        <h3 class="mb-2 line-clamp-2 min-h-[2.5rem] font-medium text-gray-800 hover:text-[#00BFA6] transition-colors cursor-pointer" onclick="navigate('produto', { id: '${product.id}' })">${product.name}</h3>
        <div class="flex items-baseline gap-1 mt-auto">
            <span class="text-xs text-gray-500">MT</span>
            <span class="text-[#00BFA6] text-xl font-bold">${(product.price || 0).toFixed(2).replace('.', ',')}</span>
        </div>
    </div>
    <div class="p-5 pt-0">
        <button data-product-id="${product.id}" class="add-to-cart-btn w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white rounded-lg transition-all duration-200 flex items-center justify-center py-2.5 font-semibold">
            <img src="https://api.iconify.design/lucide/shopping-cart.svg?color=white" class="w-4 h-4 mr-2" alt="Carrinho"/>
            Adicionar ao Carrinho
        </button>
    </div>
`;
        grid.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.currentTarget.dataset.productId;
            const productToAdd = await api.getProductById(productId);
            if (productToAdd) {
                api.addToCart(productToAdd);
                alert(`"${productToAdd.name}" foi adicionado ao carrinho!`);
                renderHeader(); // Atualiza a contagem no cabeçalho
            }
        });
    });
};

const renderCategoryFilters = (categories) => {
    const filtersContainer = document.getElementById('category-filters');
    if (!filtersContainer) return;

    let filtersHTML = `
        <div class="flex items-center gap-2 text-gray-600">
            <img src="https://api.iconify.design/lucide/filter.svg" class="w-4 h-4" alt="Filtro"/>
            <span class="text-sm font-medium">Categorias:</span>
        </div>
        <button class="category-filter-btn active" data-category="Todos">Todos</button>
    `;

    categories.forEach(category => {
        filtersHTML += `<button class="category-filter-btn" data-category="${category}">${category}</button>`;
    });

    filtersContainer.innerHTML = filtersHTML;

    filtersContainer.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            document.querySelector('.category-filter-btn.active').classList.remove('active');
            e.target.classList.add('active');

            const category = e.target.dataset.category;
            const allProducts = await api.getProducts();
            if (category === 'Todos') {
                renderProducts(allProducts);
            } else {
                const filteredProducts = allProducts.filter(p => p.category === category);
                renderProducts(filteredProducts);
            }
        });
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .category-filter-btn { padding: 6px 16px; border: 1px solid #d1d5db; border-radius: 9999px; font-size: 14px; cursor: pointer; transition: all 0.2s; background-color: white; }
        .category-filter-btn:hover { background-color: #f3f4f6; border-color: #9ca3af; }
        .category-filter-btn.active { background-color: #00BFA6; color: white; border-color: #00BFA6; font-weight: 500;}
    `;
    document.head.appendChild(style);
};
