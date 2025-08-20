const request = require('supertest');

let app;
let products;
let cartModule;
let cart;
let checkoutModule;
let orders;

const initialMockProducts = [
    { id: 1, name: "Camiseta", price: 49.90, stock: 150 },
    { id: 2, name: "Tênis", price: 199.90, stock: 80 },
    { id: 3, name: "Calça Jeans", price: 129.90, stock: 120 },
    { id: 4, name: "Jaqueta", price: 249.90, stock: 60 },
    { id: 5, name: "Boné", price: 39.90, stock: 200 }
];

const mockCartItemsForCheckout = [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 }
];

describe('Testes de Checkout', () => { 
    beforeEach(() => {
        jest.resetModules();

        app = require('../app');
        products = require('../data/products');
        cartModule = require('../routes/cart');
        cart = cartModule.cart;
        checkoutModule = require('../routes/checkout');
        orders = checkoutModule.orders;

        products.length = 0;
        initialMockProducts.forEach(p => products.push(JSON.parse(JSON.stringify(p))));

        cart.length = 0;
        mockCartItemsForCheckout.forEach(item => cart.push(JSON.parse(JSON.stringify(item))));

        orders.length = 0;
    });

    afterEach(() => {
        process.removeAllListeners('uncaughtException');
        process.removeAllListeners('unhandledRejection');
    });

    describe('POST /api/checkout', () => {
        it('Deve fazer o checkout com sucesso', async () => {
            const res = await request(app)
                .post('/api/checkout')
                .send({
                    paymentMethod: 'cartao', 
                    address: 'Rua Villa Kenedy, 17'
                });

            expect(res.statusCode).toBe(202);
            expect(res.body).toHaveProperty('orderId');
            expect(res.body).toHaveProperty('status', 'processing');
            expect(orders.length).toBe(1); 
            expect(cart.length).toBe(0); 
        });

        it('Não deve fazer checkout com carrinho vazio', async () => {
            cart.length = 0; 
            const res = await request(app)
                .post('/api/checkout')
                .send({ paymentMethod: 'cartao', address: 'Residencial Francisco Vieira, 11' });
            expect(res.statusCode).toBe(400);
        });

        it('Não deve fazer checkout sem dados obrigatorios', async () => {
            const res = await request(app).post('/api/checkout').send({});
            expect(res.statusCode).toBe(400);
        });

        it('Não deve fazer checkout se estoque for insuficiente', async () => {
            cart.length = 0;
            cart.push({ productId: 2, quantity: 999 }); 
            const res = await request(app)
                .post('/api/checkout')
                .send({ paymentMethod: 'cartao', address: 'Rua Santa Inês, 126' });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/checkout/:orderId/confirm', () => {
        let testOrderId;

        beforeEach(async () => { 
            products.length = 0;
            initialMockProducts.forEach(p => products.push(JSON.parse(JSON.stringify(p))));
            cart.length = 0;
            mockCartItemsForCheckout.forEach(item => cart.push(JSON.parse(JSON.stringify(item))));
            orders.length = 0;

            const res = await request(app)
                .post('/api/checkout')
                .send({ paymentMethod: 'cartao', address: 'Rua XYZ, 456' });
            testOrderId = res.body.orderId;
        });

        it('Deve confirmar pagamento com sucesso e atualizar estoque', async () => {
            const res = await request(app)
                .post(`/api/checkout/${testOrderId}/confirm`)
                .send({ paymentStatus: 'success' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status', 'paid');
            expect(cart.length).toBe(0);
        });

        it('Deve registrar o pagamento como falho', async () => {
            const res = await request(app)
                .post(`/api/checkout/${testOrderId}/confirm`)
                .send({ paymentStatus: 'failed' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status', 'failed');
        });

        it('Não deve confirmar o pagamento de um pedido não encontrado', async () => {
            const res = await request(app)
                .post(`/api/checkout/99999/confirm`)
                .send({ paymentStatus: 'success' });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('GET /api/orders/:orderId', () => {
        let createdOrderId;

        beforeEach(async () => { 
            products.length = 0;
            initialMockProducts.forEach(p => products.push(JSON.parse(JSON.stringify(p))));
            cart.length = 0;
            mockCartItemsForCheckout.forEach(item => cart.push(JSON.parse(JSON.stringify(item))));
            orders.length = 0;

            const checkoutRes = await request(app)
                .post('/api/checkout')
                .send({ paymentMethod: 'cartao', address: 'Rua dos perdidos' });
            createdOrderId = checkoutRes.body.orderId;

            await request(app)
                .post(`/api/checkout/${createdOrderId}/confirm`)
                .send({ paymentStatus: 'success' });
        });

        it('Deve pegar detalhes do pedido', async () => {
            const res = await request(app).get(`/api/orders/${createdOrderId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('orderId', createdOrderId);
            expect(res.body).toHaveProperty('status', 'paid');
            expect(res.body).toHaveProperty('items'); 
        });

        it('Não deve pegar um pedido nao encontrado', async () => {
            const res = await request(app).get(`/api/orders/99999`);
            expect(res.statusCode).toBe(404);
        });
    });
});