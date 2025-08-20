const request = require('supertest');
const app = require('../app.js');
let productsModule = require('../data/products');
let products = productsModule;

const initialMockProducts = [
    { id: 1, name: "Camiseta", price: 49.90, description: "Camiseta 100% algodão", category: "Roupas", stock: 150 },
    { id: 2, name: "Tênis", price: 199.90, description: "Tênis esportivo", category: "Calçados", stock: 80 },
    { id: 3, name: "Calça Jeans", price: 129.90, description: "Calça jeans slim fit", category: "Roupas", stock: 120 }
];

describe('Testes de Produtos', () => { 
    beforeEach(() => { 
        products.length = 0; 
        initialMockProducts.forEach(p => products.push(JSON.parse(JSON.stringify(p))));
    });

    describe('GET /api/products', () => {
        it('Deve pegar todos os produtos', async () => {
            const res = await request(app).get('/api/products');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0); 
        });

        it('Deve retornar vazio se nao tem produtos', async () => {
            products.length = 0;
            const res = await request(app).get('/api/products');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });

    describe('GET /api/products/:id', () => {
        it('Deve pegar um produto por id', async () => {
            const res = await request(app).get('/api/products/1');
            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(1);
        });

        it('Não deve achar produto não existente', async () => {
            const res = await request(app).get('/api/products/999');
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message'); 
        });

        it('Não deve achar com ID invalido', async () => {
            const res = await request(app).get('/api/products/abc');
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /api/products', () => {
        it('Deve criar um produto novo', async () => {
            const newProductData = {
                name: 'Produto Teste',
                price: 10.00,
                stock: 10
            };
            const res = await request(app)
                .post('/api/products')
                .send(newProductData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
        });

        it('Não deve criar sem nome ou preco', async () => {
            const res = await request(app).post('/api/products').send({ price: 10.00 });
            expect(res.statusCode).toBe(400);
            const res2 = await request(app).post('/api/products').send({ name: 'Produto' });
            expect(res2.statusCode).toBe(400);
        });

        it('Não deve criar com valores negativos', async () => {
            const res = await request(app).post('/api/products').send({ name: 'X', price: -5, stock: 10 });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('PUT /api/products/:id', () => {
        it('Deve atualizr um produto', async () => {
            const res = await request(app)
                .put('/api/products/1')
                .send({ price: 60.00 });
            expect(res.statusCode).toBe(200);
            expect(res.body.price).toBe(60.00);
        });

        it('Não deve atualizar produto não existente', async () => {
            const res = await request(app)
                .put('/api/products/999')
                .send({ price: 10.00 });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('Deve deletar um produto', async () => {
            const res = await request(app).delete('/api/products/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
        });

        it('Não deve deletar produto não existente', async () => {
            const res = await request(app).delete('/api/products/999');
            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /api/products/:id/stock', () => {
        it('Deve atualizar o estoque', async () => {
            const res = await request(app)
                .put('/api/products/1/stock')
                .send({ quantity: 10 });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
        });

        it('Não deve atualizar estoque de produto não existente', async () => {
            const res = await request(app)
                .put('/api/products/999/stock')
                .send({ quantity: 10 });
            expect(res.statusCode).toBe(404);
        });
    });
});