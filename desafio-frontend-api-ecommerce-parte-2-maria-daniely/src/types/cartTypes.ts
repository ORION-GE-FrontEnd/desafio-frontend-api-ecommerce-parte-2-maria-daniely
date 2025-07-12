export interface Product { 
  id: string;
  nome: string;
  imagemUrl?: string;
  valor: number;
}

export interface CartItem extends Product {
  quantidade: number;
}

export interface CartState {
  itens: CartItem[];
}