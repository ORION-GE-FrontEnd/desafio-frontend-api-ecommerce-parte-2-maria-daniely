const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Rotas
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

app.get('/', (req, res) => {
  res.send('<h1>testando</h1>');
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', checkoutRoutes);

// Rota desconhecida
app.use((req, res) => {
  res.status(404).send({ error: 'Rota desconhecida' });
});

// Tratamento global de erros
process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Rejeição não tratada:', reason);
});

module.exports = app;
