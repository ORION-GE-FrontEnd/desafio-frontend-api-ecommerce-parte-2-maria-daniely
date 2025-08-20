const express = require('express');
const router = express.Router();

let products = require('../data/products'); 
//geradora de id
const getNextProductId = () => {
  const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
  return maxId + 1;
};

// lista todos os produtos
router.get('/', (req, res) => {
  res.json(products);
}); 

// consultar produto por id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado '});
  }

  res.json(product);
});

// criar um novo produto
router.post('/', (req, res) => {
  const { name, price, description, category, stock } = req.body;

  if(!name || price === undefined) {
    return res.status(400).json({ message: 'Nome e preço são obrigatórios'});
  }
  if (price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Preço e estoque não podem ser negativos.' });
  }

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct = {
    id: newId,
    name,
    price,
    description: description || '',
    category: category || 'Outros',
    stock: stock || 0, 
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// atualizar produto existente
router.put('/:id', (req, res) =>{
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);

  if(productIndex === -1) {
    return res.status(404).json({ message: 'Produto não encontrado '});
  }

  const { name, price, description, category, stock } = req.body;

  if (
    name === undefined &&
    price === undefined &&
    description === undefined &&
    category === undefined &&
    stock === undefined
  ) {
    return res.status(400).json({ message: 'Nenhum dado para atualizar foi fornecido.' });
  }
  if (price !== undefined && price < 0 || stock !== undefined && stock < 0) {
      return res.status(400).json({ message: 'Preço e estoque não podem ser negativos.' });
  }

  const allowedFields = ['name', 'price', 'description', 'category', 'stock'];
  const updates = req.body;

  allowedFields.forEach(field => {
    if(updates[field] !== undefined) {
      products[productIndex][field] = updates[field];
    }
  });

  res.json(products[productIndex]);
});

// deletar produto
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);

  if(productIndex === -1) {
    return res.status(404).json({ message: 'Produto não encontrado '});
  }

  const removedProduct = products.splice(productIndex, 1)[0];

  res.json({ message: 'Produto removido com sucesso ', product: removedProduct });
});

// controle de Estoque
router.put('/:id/stock', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;

  if (quantity === undefined || isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({ error: 'A quantidade para atualizar o estoque é obrigatória e deve ser um número inteiro não negativo.' });
  }

  let product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado para atualizar estoque.' });
  }

  product.stock = quantity;

  res.status(200).json({ message: 'Estoque atualizado com sucesso' });
});

module.exports = router;