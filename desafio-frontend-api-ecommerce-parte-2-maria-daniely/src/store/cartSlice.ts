import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; 
import type { CartState, CartItem, Product } from '../types/cartTypes'; 
const initialState: CartState = {
  itens: [],
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
    },
    alterarQuantidade: (state, action: PayloadAction<{ id: string; novaQuantidade: number }>) => {
      const { id, novaQuantidade } = action.payload;
      const itemExistente = state.itens.find(item => item.id === id);

      if (itemExistente) {
        itemExistente.quantidade = Math.max(1, novaQuantidade);
        if (itemExistente.quantidade === 0) {
          state.itens = state.itens.filter(item => item.id !== id);
        }
      }
    },
    removerItem: (state, action: PayloadAction<string>) => {
      const idRemover = action.payload;
      state.itens = state.itens.filter(item => item.id !== idRemover);
    },
    limparCarrinho: (state) => {
      state.itens = [];
    },
  },
});

export const { adicionarItem, alterarQuantidade, removerItem, limparCarrinho } = cartSlice.actions;
export default cartSlice.reducer;