// interfaces para os dados retornados pela sua API REST
export interface ProductAPI {
    id: number;
    name: string;
    price: number;
    description?: string;
    category?: string;
    stock?: number;
    imageUrl?: string;
}

export interface CartItemAPI {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export interface CartAPIResponse {
    message: string;
    items: CartItemAPI[];
    totalItems: number;
    totalPrice: number;
}

export interface OrderItemFromAPI {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderFromAPI {
  orderId: string;
  items: OrderItemFromAPI[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  address: string;
  createdAt: string;
}