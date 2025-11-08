const loadProductDetailPage = async () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        container.innerHTML = `<p class="text-center text-red-500">Produto não encontrado.</p>`;
        return;
    }

    const product = await api.getProductById(productId);
    const recommendedProducts = await api.getRecommendedProducts(productId);

    if (!product) {
        container.innerHTML = `<p class="text-center text-red-500">Produto não encontrado.</p>`;
        return;
    }

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
                    ${product.recommended ? `<span class="inline-block bg-[#00BFA6]/10 text-[#00BFA6] text-xs font-medium px-3 py-1 rounded-full mb-3 ml-2">Recomendado</span>` : ''}
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">${product.name}</h1>
                    <p class="text-gray-600">${product.description}</p>
                </div>

                <div class="border-t border-gray-200"></div>

                <div class="flex items-baseline gap-2">
                    <span class="text-gray-500 text-xl">MT</span>
                    <span class="text-[#00BFA6] text-4xl font-bold">${product.price.toFixed(2).replace('.', ',')}</span>
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
                <!-- Recomendados aqui -->
            </div>
        </div>
    `;

    document.getElementById('add-to-cart-detail-btn').addEventListener('click', () => {
        api.addToCart(product);
        alert(`"${product.name}" foi adicionado ao carrinho!`);
        renderHeader();
    });

    const recommendedGrid = document.getElementById('recommended-products-grid');
    if (recommendedProducts.length > 0) {
        recommendedProducts.forEach(recProduct => {
            const card = document.createElement('div');
            card.className = "group overflow-hidden border border-gray-200 hover:border-[#00BFA6] transition-all duration-300 hover:shadow-lg cursor-pointer bg-white rounded-xl";
            card.onclick = () => navigate('produto', { id: recProduct.id });
            card.innerHTML = `
                <div class="relative overflow-hidden aspect-square bg-gray-50">
                    <img src="${recProduct.image}" alt="${recProduct.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div class="p-4">
                    <p class="text-sm text-gray-600 mb-1">${recProduct.category}</p>
                    <h4 class="text-sm font-medium mb-2 line-clamp-2">${recProduct.name}</h4>
                    <p class="font-bold text-[#00BFA6]">MT ${recProduct.price.toFixed(2).replace('.', ',')}</p>
                </div>
            `;
            recommendedGrid.appendChild(card);
        });
    } else {
        recommendedGrid.innerHTML = `<p>Sem recomendações no momento.</p>`;
    }
};