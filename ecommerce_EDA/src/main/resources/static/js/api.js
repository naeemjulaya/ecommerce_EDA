// Dados Mockados (Simulando um banco de dados)
const mockProducts = [
    { id: '1', name: 'Curso de Estruturas de Dados Avançadas', description: 'Aprenda sobre árvores, grafos, e mais.', price: 1250.00, image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop', category: 'Cursos', recommended: true },
    { id: '2', name: 'Livro "Algoritmos: Teoria e Prática"', description: 'Um guia completo sobre algoritmos.', price: 450.50, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop', category: 'Livros' },
    { id: '3', name: 'Pacote de Aulas Particulares de Programação', description: '10 horas de aulas com um especialista.', price: 4000.00, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop', category: 'Aulas' },
    { id: '4', name: 'Template de E-commerce Educacional', description: 'Template completo para sua loja.', price: 800.00, image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2231&auto=format&fit=crop', category: 'Templates' },
    { id: '5', name: 'Curso de JavaScript Moderno (ES6+)', description: 'Do básico ao avançado em JS.', price: 990.00, image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop', category: 'Cursos', recommended: true },
    { id: '6', name: 'Livro "Código Limpo"', description: 'Um clássico sobre boas práticas de codificação.', price: 380.00, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2070&auto=format&fit=crop', category: 'Livros' },
    { id: '7', name: 'Mentoria de Carreira em TI', description: 'Planeje seu futuro na área de tecnologia.', price: 2500.00, image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop', category: 'Aulas', recommended: true },
    { id: '8', name: 'Ícones para Projetos de UI/UX', description: 'Pacote com +500 ícones vetorizados.', price: 150.00, image: 'https://images.unsplash.com/photo-1629075110942-0d184761a2a8?q=80&w=2127&auto=format&fit=crop', category: 'Templates', recommended: true },
];

const mockOrders = [
    { id: '#3021', userId: 'João Silva', items: [], total: 1700.50, status: 'completed', date: '2025-10-20' },
    { id: '#3022', userId: 'Maria Santos', items: [], total: 450.50, status: 'processing', date: '2025-10-21' },
    { id: '#3023', userId: 'Pedro Almeida', items: [], total: 4000.00, status: 'pending', date: '2025-10-22' },
];

// Funções da "API"
const api = {
    getProducts: () => Promise.resolve(mockProducts),
    getProductById: (id) => Promise.resolve(mockProducts.find(p => p.id === id)),
    getRecommendedProducts: (currentProductId) => {
        return Promise.resolve(mockProducts.filter(p => p.id !== currentProductId && p.recommended).slice(0, 4));
    },
    getOrders: () => Promise.resolve(mockOrders),

    // Gerenciamento de Carrinho (localStorage)
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
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ product, quantity: 1 });
        }
        api.saveCart(cart);
    },
    updateCartItemQuantity: (productId, quantity) => {
        let cart = api.getCart();
        const item = cart.find(item => item.product.id === productId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                cart = cart.filter(item => item.product.id !== productId);
            }
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

    // Gerenciamento de Usuário (sessionStorage)
    login: (email) => {
        const isAdmin = email.toLowerCase().includes('admin');
        const user = { email, isAdmin };
        sessionStorage.setItem('user', JSON.stringify(user));
        return user;
    },
    logout: () => {
        sessionStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};