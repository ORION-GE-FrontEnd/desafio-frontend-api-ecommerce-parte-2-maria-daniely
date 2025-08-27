import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Produto {
    id: ID!
    nome: String!
    valor: Float!
    imagemUrl: String
    description: String
    category: String
    stock: Int
  }

  type ItemCarrinho {
    id: ID!
    nome: String!
    valor: Float!
    quantidade: Int!
    imagemUrl: String
  }

  type Pedido {
    orderId: ID!
    items: [ItemPedido!]!
    totalAmount: Float!
    status: String!
    paymentMethod: String!
    address: String!
    createdAt: String!
  }

  type ItemPedido {
    productId: ID!
    name: String!
    quantity: Int!
    price: Float!
  }

  type Usuario {
    userId: ID!
    nome: String!
    email: String!
    token: String
  }

  type Query {
    produtos: [Produto!]!
    carrinho: [ItemCarrinho!]!
    me: Usuario
    pedidos: [Pedido!]!
  }

  type Mutation {
    adicionarAoCarrinho(produtoId: ID!, quantidade: Int!): [ItemCarrinho!]
    removerDoCarrinho(produtoId: ID!): [ItemCarrinho!]
    alterarQuantidade(produtoId: ID!, novaQuantidade: Int!): [ItemCarrinho!]
    limparCarrinho: [ItemCarrinho!]

    login(email: String!, senha: String!): Usuario!
    checkout(paymentMethod: String!, address: String!): Pedido!
  }
`;