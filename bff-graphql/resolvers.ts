import { ProductService, CartService, OrderService, UserService } from './services';
import { ProductAPI } from './interfaces';

const resolvers = {
  Query: {
    produtos: async () => {
      const produtos = await ProductService.getAllProducts();
      return produtos.map((p: ProductAPI) => ({
        id: p.id.toString(),
        nome: p.name,
        valor: p.price,
        imagemUrl: p.imageUrl,
        description: p.description,
        category: p.category,
        stock: p.stock
      }));
    },
    carrinho: async () => {
      const response = await CartService.getCart();
      return response.items.map((item) => ({
        id: item.id.toString(),
        nome: item.name,
        valor: item.price,
        quantidade: item.quantity,
        imagemUrl: item.imageUrl
      }));
    },
    me: async () => {
      return UserService.getLoggedInUser();
    },
    pedidos: async () => {
      const orders = await OrderService.getOrders();
      return orders;
    }
  },
  Mutation: {
    adicionarAoCarrinho: async (_: any, { produtoId, quantidade }: { produtoId: string, quantidade: number }) => {
      const response = await CartService.addToCart(produtoId, quantidade);
      return response.items.map((item) => ({
        id: item.id.toString(),
        nome: item.name,
        valor: item.price,
        quantidade: item.quantity,
        imagemUrl: item.imageUrl
      }));
    },
    removerDoCarrinho: async (_: any, { produtoId }: { produtoId: string }) => {
      const response = await CartService.removeFromCart(produtoId);
      return response.items.map((item) => ({
        id: item.id.toString(),
        nome: item.name,
        valor: item.price,
        quantidade: item.quantity,
        imagemUrl: item.imageUrl
      }));
    },
    alterarQuantidade: async (_: any, { produtoId, novaQuantidade }: { produtoId: string, novaQuantidade: number }) => {
      const response = await CartService.updateCartQuantity(produtoId, novaQuantidade);
      return response.items.map((item) => ({
        id: item.id.toString(),
        nome: item.name,
        valor: item.price,
        quantidade: item.quantity,
        imagemUrl: item.imageUrl
      }));
    },
    limparCarrinho: async (_: any) => {
      await CartService.clearCart();
      return [];
    },
    login: async (_: any, { email, senha }: { email: string, senha: string }) => {
      return UserService.login(email, senha);
    },
    checkout: async (_: any, { paymentMethod, address }: { paymentMethod: string, address: string }) => {
      const order = await OrderService.checkout(paymentMethod, address);
      if (order.error) {
        throw new Error(order.error);
      }
      return order;
    }
  },
};

export default resolvers;