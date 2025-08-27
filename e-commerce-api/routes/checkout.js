const express = require('express');
const router = express.Router();

let products = require('../data/products'); 
let cartModule = require('./cart');
let cart = cartModule.cart;

// ===================================================================
// DADOS DE TESTE - Substitua a linha let orders = []; por esta:
// ===================================================================
let orders = [
  {
    orderId: '12',
    items: [
      { productId: 1, name: 'Camiseta', quantity: 2, price: 49.90 },
      { productId: 5, name: 'Boné', quantity: 1, price: 39.90 }
    ],
    totalAmount: 139.7,
    status: 'paid',
    paymentMethod: 'credit_card',
    address: 'Rua de Teste, 123, Bairro Exemplo',
    createdAt: new Date().toISOString()
  }
]; 
// ===================================================================

// Geradora de IDs
const generateOrderId = () => {
  // ... (resto do seu código, sem alterações)
  const maxId = orders.length > 0
    ? Math.max(...orders.map(o => parseInt(o.orderId) || 0))
    : 0;
  return (maxId + 1).toString();
};

// ... (todo o resto do seu arquivo checkout.js continua igual)
// router.post('/checkout', ... etc

router.post('/checkout', (req, res) => {
  const { paymentMethod, address } = req.body;

  if (cart.length === 0) {
    return res.status(400).json({ error: 'Carrinho de compras vazio. Adicione produtos antes de finalizar.' });
  }

  if (!paymentMethod || !address) {
    return res.status(400).json({ error: 'Método de pagamento e endereço são obrigatórios.' });
  }

  let totalAmount = 0;
  const orderItems = [];
  const stockChanges = [];

  for (const cartItem of cart) {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) {
      return res.status(500).json({ error: `Erro interno: Produto ID ${cartItem.productId} no carrinho não encontrado no catálogo.` });
    }
    if (product.stock < cartItem.quantity) {
      return res.status(400).json({ error: `Estoque insuficiente para ${product.name}. Apenas ${product.stock} em estoque.` });
    }

    totalAmount += product.price * cartItem.quantity;
    orderItems.push({
      productId: product.id,
      name: product.name,
      quantity: cartItem.quantity,
      price: product.price
    });
    stockChanges.push({ productId: product.id, quantityToDeduct: cartItem.quantity });
  }

  const newOrder = {
    orderId: generateOrderId(),
    items: orderItems,
    totalAmount,
    status: 'processing',
    paymentMethod,
    address,
    createdAt: new Date().toISOString(),
    _stockChanges: stockChanges
  };

  orders.push(newOrder);
  cart.splice(0, cart.length); // esvaziar o carrinho

  res.status(202).json({
    orderId: newOrder.orderId,
    totalAmount: newOrder.totalAmount,
    status: newOrder.status
  });
});

// Confirmar o pagamento
router.post('/checkout/:orderId/confirm', (req, res) => {
  const orderId = req.params.orderId;
  const { paymentStatus } = req.body;

  let order = orders.find(o => o.orderId === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  if (['paid', 'cancelled', 'failed'].includes(order.status)) {
    return res.status(400).json({ error: `O pedido já está no status ${order.status}.` });
  }

  if (paymentStatus === 'success') {
    order.status = 'paid';
    order.paidAt = new Date().toISOString();

    for (const change of order._stockChanges) {
      const product = products.find(p => p.id === change.productId);
      if (product) {
        product.stock -= change.quantityToDeduct;
      }
    }
    delete order._stockChanges;

    cart.splice(0, cart.length);

    res.status(200).json({
      message: 'Pagamento confirmado',
      orderId: order.orderId,
      status: order.status
    });
  } else if (paymentStatus === 'failed') {
    order.status = 'failed';
    res.status(200).json({
      message: 'Pagamento falhou',
      orderId: order.orderId,
      status: order.status
    });
  } else {
    return res.status(400).json({ error: 'Status de pagamento inválido. Use "success" ou "failed".' });
  }
});

// Visualizar um pedido
router.get('/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const order = orders.find(o => o.orderId === orderId);

  if (order) {
    const formattedItems = order.items.map(item => {
      const productDetail = products.find(p => p.id === item.productId);
      return {
        name: productDetail ? productDetail.name : item.name,
        quantity: item.quantity,
        price: item.price
      };
    });

    res.status(200).json({
      orderId: order.orderId,
      items: formattedItems,
      totalAmount: order.totalAmount,
      status: order.status
    });
  } else {
    res.status(404).json({ error: 'Pedido não encontrado.' });
  }
});

router.get('/orders', (req, res) => {
    // A variável 'orders' já existe no topo deste arquivo
    res.status(200).json(orders); 
});

module.exports = router;

// Para testes:
module.exports.orders = orders;
module.exports.cart = cart;
module.exports.products = products;