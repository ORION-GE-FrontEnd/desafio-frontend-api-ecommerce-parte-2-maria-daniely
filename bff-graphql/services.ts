import fetch from 'node-fetch';
import { ProductAPI, CartAPIResponse, OrderFromAPI } from './interfaces';

const BASE_URL = 'http://localhost:3001/api';

// Funções para a API de Produtos
export const ProductService = {
    getAllProducts: async (): Promise<ProductAPI[]> => {
        const response = await fetch(`${BASE_URL}/products`);
        if (!response.ok) {
            throw new Error(`Erro na API de produtos: ${response.statusText}`);
        }
        return await response.json() as ProductAPI[];
    }
};

// Funções para a API de Carrinho
export const CartService = {
    getCart: async (): Promise<CartAPIResponse> => {
        const response = await fetch(`${BASE_URL}/cart`);
        if (!response.ok) {
            throw new Error(`Erro na API de carrinho: ${response.statusText}`);
        }
        return await response.json() as CartAPIResponse;
    },
    addToCart: async (productId: string, quantity: number): Promise<CartAPIResponse> => {
        const response = await fetch(`${BASE_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: parseInt(productId), quantity }),
        });
        if (!response.ok) {
            const errorData = await response.json() as { error?: string };
            throw new Error(errorData.error || 'Erro ao adicionar ao carrinho.');
        }
        return CartService.getCart();
    },
    removeFromCart: async (productId: string): Promise<CartAPIResponse> => {
        const response = await fetch(`${BASE_URL}/cart/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json() as { error?: string };
            throw new Error(errorData.error || 'Erro ao remover do carrinho.');
        }
        return CartService.getCart();
    },
    updateCartQuantity: async (productId: string, newQuantity: number): Promise<CartAPIResponse> => {
        const response = await fetch(`${BASE_URL}/cart/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity }),
        });
        if (!response.ok) {
            const errorData = await response.json() as { error?: string };
            throw new Error(errorData.error || 'Erro ao atualizar quantidade no carrinho.');
        }
        return CartService.getCart();
    },
    clearCart: async (): Promise<{ items: [] }> => {
        await fetch(`${BASE_URL}/cart`, {
            method: 'DELETE',
        });
        return { items: [] };
    }
};

// Funções para a API de Checkout e Pedidos
export const OrderService = {
    checkout: async (paymentMethod: string, address: string): Promise<{ orderId: string, totalAmount: number, status: string, error?: string }> => {
        const response = await fetch(`${BASE_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentMethod, address }),
        });
        return await response.json() as { orderId: string, totalAmount: number, status: string, error?: string };
    },

    getOrders: async (): Promise<OrderFromAPI[]> => {
        const response = await fetch(`${BASE_URL}/orders`);
        if (!response.ok) {
            console.error('Erro ao buscar pedidos na API REST');
            return [];
        }
   
        return await response.json() as OrderFromAPI[];
    }
};

// Funções para a API de Usuários/Login
export const UserService = {
    login: async (email: string, senha: string): Promise<{ userId: string, nome: string, email: string, token: string }> => {
        return {
            userId: '13',
            nome: 'Daniely Vasconcelos',
            email: email,
            token: '123456teste'
        };
    },
    getLoggedInUser: async (): Promise<{ userId: string, nome: string, email: string, token: string }> => {
        return {
            userId: '13',
            nome: 'Daniely Vasconcelos',
            email: 'danigatinha@gmail.com',
            token: '123456teste'
        };
    }
};