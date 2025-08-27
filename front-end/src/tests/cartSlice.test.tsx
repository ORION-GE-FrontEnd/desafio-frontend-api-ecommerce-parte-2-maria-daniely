import cartReducer, {
  adicionarItem,
  alterarQuantidade,
  removerItem,
  limparCarrinho,
} from '../store/cartSlice';
import type { CartState, Product } from '../types/cartTypes';

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('cartSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  const produtoExemplo: Product = {
    id: '1',
    nome: 'Produto Teste',
    valor: 100,        
  };

  test('estado inicial vazio se localStorage estiver vazio', () => {
    (localStorageMock.getItem as jest.Mock).mockReturnValueOnce(null);

    const initialState = cartReducer(undefined, { type: '@@INIT' });

    expect(initialState.itens).toEqual([]);
  });

  test('adicionarItem adiciona novo produto', () => {
    const initialState: CartState = { itens: [] };

    const novoEstado = cartReducer(initialState, adicionarItem(produtoExemplo));

    expect(novoEstado.itens).toHaveLength(1);
    expect(novoEstado.itens[0]).toMatchObject({ id: '1', quantidade: 1 });
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('adicionarItem incrementa quantidade se item já existe', () => {
    const initialState: CartState = { itens: [{ ...produtoExemplo, quantidade: 1 }] };

    const novoEstado = cartReducer(initialState, adicionarItem(produtoExemplo));

    expect(novoEstado.itens).toHaveLength(1);
    expect(novoEstado.itens[0].quantidade).toBe(2);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('alterarQuantidade atualiza quantidade', () => {
    const initialState: CartState = { itens: [{ ...produtoExemplo, quantidade: 1 }] };

    const novoEstado = cartReducer(
      initialState,
      alterarQuantidade({ id: '1', novaQuantidade: 5 })
    );

    expect(novoEstado.itens[0].quantidade).toBe(5);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('alterarQuantidade com 0 mantém quantidade mínima 1', () => {
    const initialState: CartState = { itens: [{ ...produtoExemplo, quantidade: 2 }] };

    const novoEstado = cartReducer(
      initialState,
      alterarQuantidade({ id: '1', novaQuantidade: 0 })
    );

    expect(novoEstado.itens).toHaveLength(1);
    expect(novoEstado.itens[0].quantidade).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('removerItem remove produto do carrinho', () => {
    const initialState: CartState = { itens: [{ ...produtoExemplo, quantidade: 2 }] };

    const novoEstado = cartReducer(initialState, removerItem('1'));

    expect(novoEstado.itens).toHaveLength(0);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('limparCarrinho esvazia o carrinho', () => {
    const initialState: CartState = { itens: [{ ...produtoExemplo, quantidade: 3 }] };

    const novoEstado = cartReducer(initialState, limparCarrinho());

    expect(novoEstado.itens).toEqual([]);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});