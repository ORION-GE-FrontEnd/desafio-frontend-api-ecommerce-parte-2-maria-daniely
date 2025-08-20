const express = require('express');
const router = express.Router();

let products = require('../data/products'); 
let cart = [
  { productId: 5, quantity: 2},
  { productId: 4, quantity: 2},
  { productId: 1, quantity: 2}
];

// Exibição dos produtos contidos no carrinho de compras
router.get('/', (req, res) => {
  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    
    if(!product) return null;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      total: cartItem.quantity * product.price
    };
  }).filter(item => item !== null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

  res.json({
    message: 'Itens no carrinho de compras',
    items: cartItems,
    totalItems,
    totalPrice
  });
});

// Exibição dos produtos adicionados no carrinho de compras
router.post('/', (req, res) => {
  const { productId, quantity } = req.body;

  // Validação robusta dos tipos
  if (
    typeof productId !== 'number' ||
    typeof quantity !== 'number' ||
    !Number.isInteger(productId) ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return res.status(400).json({
      error: 'productId e quantity devem ser números inteiros e quantity deve ser maior que zero.'
    });
  }

  // Verifica se o produto existe
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  // Verifica se há estoque suficiente
  if (product.stock < quantity) {
      return res.status(400).json({ error: `Estoque insuficiente para ${product.name}. Apenas ${product.stock} em estoque.` });
  }

  // Verifica se o produto já está no carrinho
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    // Verifica estoque antes de adicionar mais ao carrinho
    if (product.stock < (existingItem.quantity + quantity)) {
      return res.status(400).json({ error: `Estoque insuficiente para adicionar mais ${product.name}.` });
    }
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  res.status(201).json({
    message: 'Produto adicionado ao carrinho com sucesso.',
    cart: cart.map(item => { // Retorna o carrinho detalhado
      const p = products.find(prod => prod.id === item.productId);
      return { id: p.id, name: p.name, quantity: item.quantity, price: p.price };
    })
  });
});

// Atualizar a quantidade de um item no carrinho
router.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const { quantity } = req.body;

  // Validação do ID e da quantidade
  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ error: 'ID do produto inválido.' });
  }

  if (quantity === undefined || isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'A quantidade deve ser um número inteiro e não pode ser negativa.' });
  }

  // Verifica se o produto existe no catálogo
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Produto não existe no catálogo.' });
  }

  // Verifica se o item está no carrinho
  const itemIndex = cart.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Produto não encontrado no carrinho para atualizar.' });
  }

  // Lógica para remover se quantity for 0
  if (quantity === 0) {
    cart.splice(itemIndex, 1);
    return res.status(200).json({ message: 'Produto removido do carrinho com sucesso (quantidade zero).' });
  }

  // Verifica se a nova quantidade excede o estoque disponível
  if (product.stock < quantity) {
      return res.status(400).json({ error: `Estoque insuficiente para a quantidade solicitada de ${product.name}. Disponível: ${product.stock}.` });
  }

  cart[itemIndex].quantity = quantity; // Atualiza a quantidade

  // Reconstrói a lista detalhada dos itens no carrinho para a resposta
  const cartItems = cart.map(cartItem => {
    const prod = products.find(p => p.id === cartItem.productId);
    return {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: cartItem.quantity,
      total: cartItem.quantity * prod.price
    };
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

  res.json({
    message: 'Quantidade atualizada com sucesso.',
    items: cartItems,
    totalItems,
    totalPrice
  });
});

// Remover um item específico do carrinho pelo productId
router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ error: 'ID do produto inválido.' });
  }

  const index = cart.findIndex(item => item.productId === productId);

  if (index === -1) {
    return res.status(404).json({ error: 'Produto não encontrado no carrinho.' });
  }

  cart.splice(index, 1);

  // Retorna o carrinho atualizado com detalhes completos
  const cartItems = cart.map(cartItem => {
    const prod = products.find(p => p.id === cartItem.productId);
    return {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: cartItem.quantity,
      total: cartItem.quantity * prod.price
    };
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

  res.json({
    message: 'Produto removido do carrinho com sucesso.',
    items: cartItems,
    totalItems,
    totalPrice
  });
});

// Esvaziar o carrinho inteiro
router.delete('/', (req, res) => {
  cart = [];

  res.json({
    message: 'Carrinho esvaziado com sucesso.',
    items: [],
    totalItems: 0,
    totalPrice: 0
  });
});

module.exports = router;
// para realizar os testes
module.exports.cart = cart;
module.exports.products = products;