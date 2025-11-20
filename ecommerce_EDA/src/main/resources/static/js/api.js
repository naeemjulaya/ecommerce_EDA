// api.js - Objeto central para comunicação com o backend Spring Boot
const api = {
    // --- URL BASE do Backend ---
    BASE_URL: 'http://localhost:8082/api',

    // --- AUTENTICAÇÃO ---
    login: async (email, senha) => {
        try {
            const res = await fetch(`${api.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('currentUser', JSON.stringify(user));
                return user;
            } else {
                const err = await res.text();
                alert(err);
                return null;
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return null;
        }
    },

    // --- REGISTRO ---
    register: async (email, senha, nome, tipoUsuario) => {
        try {
            const res = await fetch(`${api.BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha, nome, tipoUsuario })
            });

            if (res.ok) {
                return await res.json();
            } else {
                const err = await res.text();
                console.error('Erro no registro:', err);
                return null;
            }
        } catch (error) {
            console.error('Erro de rede no registro:', error);
            return null;
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    logout: () => {
        localStorage.removeItem('currentUser');
    },

    // --- PRODUTOS ---
    getProducts: async () => {
        try {
            const response = await fetch(`${api.BASE_URL}/produtos`);
            if (response.ok) {
                const data = await response.json();
                console.log("Produtos recebidos do backend:", data); // Log para debug
                return data;
            } else {
                console.error('Erro ao buscar produtos:', response.status, await response.text());
                return [];
            }
        } catch (error) {
            console.error('Erro de rede ao buscar produtos:', error);
            return [];
        }
    },

    getProductById: async (id) => {
        try {
            const response = await fetch(`${api.BASE_URL}/produtos/${id}`);
            if (response.ok) return await response.json();
            else {
                console.error('Erro ao buscar produto por ID:', response.status, await response.text());
                return null;
            }
        } catch (error) {
            console.error('Erro de rede ao buscar produto por ID:', error);
            return null;
        }
    },

    getProductsByName: async (nome) => {
        try {
            const response = await fetch(`${api.BASE_URL}/produtos/search?nome=${encodeURIComponent(nome)}`);
            if (response.ok) return await response.json();
            else {
                console.error('Erro ao buscar produto por nome:', response.status, await response.text());
                return [];
            }
        } catch (error) {
            console.error('Erro de rede ao buscar produto por nome:', error);
            return [];
        }
    },

    // --- AVALIAÇÕES ---
    getAvaliacoesByProdutoId: async (produtoId) => {
        try {
            const response = await fetch(`${api.BASE_URL}/avaliacoes/produto/${produtoId}`);
            if (response.ok) return await response.json();
            else {
                console.error('Erro ao buscar avaliações:', response.status, await response.text());
                return [];
            }
        } catch (error) {
            console.error('Erro de rede ao buscar avaliações:', error);
            return [];
        }
    },

    salvarAvaliacao: async (avaliacaoData) => {
        try {
            const response = await fetch(`${api.BASE_URL}/avaliacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(avaliacaoData),
            });

            if (response.ok) return await response.json();
            else {
                console.error('Erro ao salvar avaliação:', response.status, await response.text());
                return null;
            }
        } catch (error) {
            console.error('Erro de rede ao salvar avaliação:', error);
            return null;
        }
    },

    // --- RECOMENDAÇÕES ---
    getRecommendedProducts: async (produtoId, profundidade = 2) => {
        try {
            const response = await fetch(`${api.BASE_URL}/recomendacoes/produto/${produtoId}?profundidade=${profundidade}`);
            if (response.ok) return await response.json();
            else {
                console.error('Erro ao buscar recomendações:', response.status, await response.text());
                return [];
            }
        } catch (error) {
            console.error('Erro de rede ao buscar recomendações:', error);
            return [];
        }
    },

    // --- ORDENS / PEDIDOS ---
    getOrders: async () => {
        try {
            const response = await fetch(`${api.BASE_URL}/pedidos`);
            if (response.ok) return await response.json();
            else {
                console.error('Erro ao buscar pedidos:', response.status, await response.text());
                return [];
            }
        } catch (error) {
            console.error('Erro de rede ao buscar pedidos:', error);
            return [];
        }
    },

    createOrder: async (orderData) => {
        try {
            const response = await fetch(`${api.BASE_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.ok) return await response.json();
            else {
                console.error('Erro ao criar pedido:', response.status, await response.text());
                return null;
            }
        } catch (error) {
            console.error('Erro de rede ao criar pedido:', error);
            return null;
        }
    },

    processarProximoPedido: async () => {
        try {
            const response = await fetch(`${api.BASE_URL}/pedidos/fila/proximo`);
            if (response.ok) return await response.json();
            else if (response.status === 204) return null;
            else {
                console.error('Erro ao processar próximo pedido:', response.status, await response.text());
                return null;
            }
        } catch (error) {
            console.error('Erro de rede ao processar próximo pedido:', error);
            return null;
        }
    },

    // --- CARRINHO (Frontend localStorage) ---
    getCart: () => {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    saveCart: (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    addToCart: (product) => {
        const cart = api.getCart();
        const existingItem = cart.find(item => item.product.id === product.id);
        if (existingItem) existingItem.quantity++;
        else cart.push({ product, quantity: 1 });
        api.saveCart(cart);
    },
    updateCartItemQuantity: (productId, quantity) => {
        let cart = api.getCart();
        const item = cart.find(item => item.product.id === productId);
        if (item) {
            if (quantity > 0) item.quantity = quantity;
            else cart = cart.filter(item => item.product.id !== productId);
        }
        api.saveCart(cart);
    },
    removeCartItem: (productId) => {
        const cart = api.getCart().filter(item => item.product.id !== productId);
        api.saveCart(cart);
    },
    clearCart: () => {
        localStorage.removeItem('cart');
    },
};

console.log("API object loaded and ready to use with Spring Boot backend.");