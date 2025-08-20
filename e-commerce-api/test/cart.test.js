const request = require('supertest');
let app;
let cartModule;
let cart;
let products;

const initialMockProducts = [
    { id: 1, name: "Camiseta", price: 49.90, stock: 150 },
    { id: 2, name: "Tênis", price: 199.90, stock: 80 },
    { id: 3, name: "Calça Jeans", price: 129.90, stock: 0 },
    { id: 4, name: "Jaqueta", price: 249.90, stock: 60 },
    { id: 5, name: "Boné", price: 39.90, stock: 200 }
];

describe('Testes do Carrinho de compras', () => { 
    beforeEach(() => {
        jest.resetModules();

        app = require('../app');
        cartModule = require('../routes/cart');
        products = require('../data/products');
        cart = cartModule.cart;

        products.length = 0; 
        initialMockProducts.forEach(p => products.push(JSON.parse(JSON.stringify(p))));

        cart.length = 0; 
        cart.push(
            { productId: 5, quantity: 2 },
            { productId: 4, quantity: 2 },
            { productId: 1, quantity: 2 }
        );
    });

    describe('GET /api/cart', () => {
        it('Deve mostrar itens no carrinho', async () => {
            const res = await request(app).get('/api/cart');
            expect(res.statusCode).toBe(200);
            expect(res.body.items.length).toBeGreaterThan(0); 
            expect(res.body).toHaveProperty('totalItems');
            expect(res.body).toHaveProperty('totalPrice');
        });

        it('Deve mostrar carrinho vazio', async () => {
            cart.length = 0; 
            const res = await request(app).get('/api/cart');
            expect(res.statusCode).toBe(200);
            expect(res.body.items.length).toBe(0);
        });
    });

    describe('POST /api/cart', () => {
        it('Deve adicionar produto ao carrinho', async () => {
            const res = await request(app)
                .post('/api/cart')
                .send({ productId: 2, quantity: 1 });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message');
        });

        it('Deve aumentar a quantidade se o produto ja existe', async () => {
            const res = await request(app)
                .post('/api/cart')
                .send({ productId: 1, quantity: 1 });
            expect(res.statusCode).toBe(201);
        });

        it('Não deve adicionar com ID ou quantidade invalidos', async () => {
            const res = await request(app).post('/api/cart').send({ productId: 'abc', quantity: 1 });
            expect(res.statusCode).toBe(400);
            const res2 = await request(app).post('/api/cart').send({ productId: 1, quantity: 'xyz' });
            expect(res2.statusCode).toBe(400);
        });

        it('Não deve adicionar produto não encontrado', async () => {
            const res = await request(app)
                .post('/api/cart')
                .send({ productId: 999, quantity: 1 });
            expect(res.statusCode).toBe(404);
        });

        it('Não deve adicionar se estoque insuficiente', async () => {
            const res = await request(app)
                .post('/api/cart')
                .send({ productId: 3, quantity: 1 });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('PUT /api/cart/:id', () => {
        it('Deve atualizar quantidade do item', async () => {
            const res = await request(app)
                .put('/api/cart/1')
                .send({ quantity: 5 });
            expect(res.statusCode).toBe(200);
        });

        it('Deve remover item se quantidade for zero', async () => {
            const res = await request(app)
                .put('/api/cart/1')
                .send({ quantity: 0 });
            expect(res.statusCode).toBe(200);
        });

        it('Não deve atualizar se produto não esta no carrinho', async () => {
            cart.length = 0; 
            const res = await request(app)
                .put('/api/cart/1')
                .send({ quantity: 1 });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/cart/:id', () => {
        it('Deve remover um item do carrinho', async () => {
            const res = await request(app).delete('/api/cart/5');
            expect(res.statusCode).toBe(200);
        });

        it('Não deve remover se o item nao for encontrado', async () => {
            cart.length = 0; 
            const res = await request(app).delete('/api/cart/5');
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/cart', () => {
        it('Deve esvaziar o carrinho', async () => {
            const res = await request(app).delete('/api/cart');
            expect(res.statusCode).toBe(200);
            const updatedCartResponse = await request(app).get('/api/cart');
            expect(updatedCartResponse.body.items.length).toBe(0);
        });
    });
});