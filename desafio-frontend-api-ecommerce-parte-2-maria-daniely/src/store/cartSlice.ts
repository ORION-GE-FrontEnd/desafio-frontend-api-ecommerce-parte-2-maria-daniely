import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, Product, CartItem } from '../types/cartTypes';

const carregarCarrinhoDoLocalStorage = (): CartItem[] => {
  try {
    const serializedCart = localStorage.getItem('carrinhoItens')
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error("Erro ao carregar carrinho do localStorage:", error);
    return [];
  }
};


const salvarCarrinhoNoLocalStorage = (itens: CartItem[]) => {
  try {
    const serializedCart = JSON.stringify(itens);
    localStorage.setItem('carrinhoItens', serializedCart); 
  } catch (error) {
    console.error("Erro ao salvar carrinho no localStorage:", error);
  }
};

const initialState: CartState = {
  itens: carregarCarrinhoDoLocalStorage(),
};

const cartSlice = createSlice({
  name: 'carrinho',
  initialState,
  reducers: {
 
    adicionarItem: (state, action: PayloadAction<Product>) => {
      const novoProduto = action.payload;
      const itemExistente = state.itens.find(item => item.id === novoProduto.id);

      if (itemExistente) {
        itemExistente.quantidade++;
      } else {
   
        state.itens.push({ ...novoProduto, quantidade: 1 });
      }
      salvarCarrinhoNoLocalStorage(state.itens); 
    },
  
    alterarQuantidade: (state, action: PayloadAction<{ id: string; novaQuantidade: number }>) => {
    const { id, novaQuantidade } = action.payload;
    const itemExistente = state.itens.find(item => item.id === id);

    if (itemExistente) {
      itemExistente.quantidade = Math.max(1, novaQuantidade);
    }

    salvarCarrinhoNoLocalStorage(state.itens);
  },

    removerItem: (state, action: PayloadAction<string>) => {
      const idRemover = action.payload;
      state.itens = state.itens.filter(item => item.id !== idRemover);
      salvarCarrinhoNoLocalStorage(state.itens); 
    },
    limparCarrinho: (state) => {
      state.itens = [];
      salvarCarrinhoNoLocalStorage(state.itens); 
    },
  },
});

export const { adicionarItem, alterarQuantidade, removerItem, limparCarrinho } = cartSlice.actions;
export default cartSlice.reducer;