
# 🛒 **Especificações do Backend - E-commerce**

## 🎯 **Objetivo**

Desenvolver o backend de um sistema de **E-commerce** que permita:
- Gerenciamento de produtos.
- Adição e atualização de itens no carrinho de compras.
- Processamento de pedidos (checkout) e controle de estoque.

---

## ✅ **Funcionalidades Principais**

### **Gerenciamento de Produtos:**
- **Listar produtos**: Obter todos os produtos disponíveis.
- **Visualizar produto específico**: Obter os detalhes de um produto.
- **Criar produto**: Adicionar novos produtos ao catálogo.
- **Editar produto**: Atualizar os detalhes de um produto existente.
- **Deletar produto**: Remover um produto do catálogo.

### **Gerenciamento de Carrinho de Compras:**
- **Visualizar carrinho**: Exibir todos os itens no carrinho de compras.
- **Adicionar produto ao carrinho**: Incluir um produto no carrinho com quantidade específica.
- **Editar quantidade no carrinho**: Alterar a quantidade de um item no carrinho.
- **Remover produto do carrinho**: Excluir um item do carrinho.

### **Processamento de Pedido (Checkout):**
- **Iniciar checkout**: Calcular o valor total e solicitar dados de pagamento.
- **Confirmar pagamento**: Confirmar o pagamento e processar o pedido.
- **Visualizar pedido**: Consultar os detalhes de um pedido após o pagamento.

### **Controle de Estoque:**
- **Atualizar estoque**: Atualizar a quantidade de um produto em estoque.

---

## 📄 **Estrutura dos Endpoints**

### **1. Gerenciamento de Produtos**

#### **Endpoint para listar produtos**
- **Rota:** `GET /api/products`
- **Descrição:** Retorna a lista de todos os produtos disponíveis no e-commerce.
- **Parâmetros:** Nenhum.
- **Resposta:** Lista de produtos.
- **Exemplo de resposta:**
  
```json
[
  {
    "id": 1,
    "name": "Produto A",
    "description": "Descrição do Produto A",
    "price": 100.0,
    "quantity": 50
  },
  {
    "id": 2,
    "name": "Produto B",
    "description": "Descrição do Produto B",
    "price": 200.0,
    "quantity": 30
  }
]
```

#### **Endpoint para visualizar um produto específico**
- **Rota:** `GET /api/products/:id`
- **Descrição:** Retorna os detalhes de um produto específico.
- **Parâmetros:** 
  - `id` (parâmetro de URL): O ID do produto.
- **Resposta:**

```json
{
  "id": 1,
  "name": "Produto A",
  "description": "Descrição do Produto A",
  "price": 100.0,
  "quantity": 50
}
```

#### **Endpoint para criar um novo produto**
- **Rota:** `POST /api/products`
- **Descrição:** Adiciona um novo produto ao catálogo.
- **Parâmetros:**
  - Corpo da requisição (JSON):

```json
{
  "name": "Produto C",
  "description": "Descrição do Produto C",
  "price": 150.0,
  "quantity": 20
}
```
- **Resposta:**

```json
{
  "id": 3,
  "name": "Produto C",
  "description": "Descrição do Produto C",
  "price": 150.0,
  "quantity": 20
}
```

#### **Endpoint para editar um produto existente**
- **Rota:** `PUT /api/products/:id`
- **Descrição:** Atualiza os dados de um produto existente.
- **Parâmetros:**
  - `id` (parâmetro de URL): O ID do produto.
  - Corpo da requisição (JSON):

```json
{
  "name": "Produto C atualizado",
  "description": "Descrição do Produto C Atualizado",
  "price": 160.0,
  "quantity": 25
}
```
- **Resposta:**

```json
{
  "id": 3,
  "name": "Produto C atualizado",
  "description": "Descrição do Produto C Atualizado",
  "price": 160.0,
  "quantity": 25
}
```

#### **Endpoint para deletar um produto**
- **Rota:** `DELETE /api/products/:id`
- **Descrição:** Remove um produto do catálogo.
- **Parâmetros:** 
  - `id` (parâmetro de URL): O ID do produto.
- **Resposta:**

```json
{
  "message": "Produto deletado com sucesso"
}
```

---

### **2. Gerenciamento de Carrinho de Compras**

#### **Endpoint para visualizar o carrinho de compras**
- **Rota:** `GET /api/cart`
- **Descrição:** Retorna todos os itens no carrinho de compras.
- **Resposta:**

```json
[
  {
    "id": 1,
    "name": "Produto A",
    "quantity": 2,
    "price": 100.0
  },
  {
    "id": 2,
    "name": "Produto B",
    "quantity": 1,
    "price": 200.0
  }
]
```

#### **Endpoint para adicionar um produto ao carrinho**
- **Rota:** `POST /api/cart`
- **Descrição:** Adiciona um produto ao carrinho.
- **Parâmetros:**
  - Corpo da requisição (JSON):

```json
{
  "id": 1,
  "quantity": 2
}
```
- **Resposta:**

```json
{
  "message": "Produto adicionado ao carrinho com sucesso"
}
```

#### **Endpoint para editar a quantidade de um item no carrinho**
- **Rota:** `PUT /api/cart/:id`
- **Descrição:** Atualiza a quantidade de um produto no carrinho.
- **Parâmetros:**
  - `id` (parâmetro de URL): O ID do produto.
  - Corpo da requisição (JSON):

```json
{
  "quantity": 3
}
```
- **Resposta:**

```json
{
  "message": "Quantidade do produto no carrinho atualizada com sucesso"
}
```

#### **Endpoint para remover um produto do carrinho**
- **Rota:** `DELETE /api/cart/:id`
- **Descrição:** Remove um item do carrinho de compras.
- **Parâmetros:**
  - `id` (parâmetro de URL): O ID do produto.
- **Resposta:**

```json
{
  "message": "Produto removido do carrinho com sucesso"
}
```

---

### **3. Processamento de Pedido (Checkout)**

#### Endpoint para iniciar o checkout
- Rota: `POST /api/checkout`
- Descrição: Inicia o processo de checkout, calcula o valor total e solicita dados de pagamento.
- Parâmetros:
  - Corpo da requisição (JSON):
```json
{
  "paymentMethod": "credit_card",
  "address": "Rua X, 123, Bairro Y"
}
```
- Resposta:
```json
{
  "orderId": "12345",
  "totalAmount": 500.0,
  "status": "processing"
}
```

#### Endpoint para confirmar o pagamento
- Rota: `POST /api/checkout/{orderId}/confirm`
- Descrição: Confirma o pagamento do pedido.
- Parâmetros:
  - `orderId` (parâmetro de URL): O ID do pedido.
  - Corpo da requisição (JSON):
```json
{
  "paymentStatus": "success"
}
```
- Resposta:
```json
{
  "message": "Pagamento confirmado",
  "orderId": "12345",
  "status": "paid"
}
```

#### Endpoint para visualizar um pedido
- Rota: `GET /api/orders/{orderId}`
- Descrição: Exibe os detalhes de um pedido.
- Parâmetros:
  - `orderId` (parâmetro de URL): O ID do pedido.
- Resposta:
```json
{
  "orderId": "12345",
  "items": [
    {
      "name": "Produto A",
      "quantity": 2,
      "price": 100.0
    },
    {
      "name": "Produto B",
      "quantity": 1,
      "price": 200.0
    }
  ],
  "totalAmount": 500.0,
  "status": "paid"
}
```

---

### **4. Controle de Estoque**

#### Endpoint para atualizar o estoque de um produto
- Rota: `PUT /api/products/{id}/stock`
- Descrição: Atualiza a quantidade em estoque de um produto.
- Parâmetros:
  - `id` (parâmetro de URL): O ID do produto.
  - Corpo da requisição (JSON):
```json
{
  "quantity": 40
}
```
- Resposta:
```json
{
  "message": "Estoque atualizado com sucesso"
}
```

---

# 📝 **Notas Finais**

- As respostas devem sempre ser fornecidas em formato JSON para garantir consistência na API.
- Não esquecer de trabalhar os status da requisição.
