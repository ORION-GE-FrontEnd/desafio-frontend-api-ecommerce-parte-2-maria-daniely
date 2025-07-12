import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import CartItem from '../CartItem/CartItem';   
import CartSummary from '../CartSummary/CartSummary'; 
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { alterarQuantidade, removerItem } from '../../store/cartSlice';
import type { CartItem as CartItemType } from '../../types/cartTypes'; 

const PaginaCarrinho: React.FC = () => { 
  const dispatch = useDispatch<AppDispatch>(); 
  const itensNoCarrinho = useSelector((state: RootState) => state.carrinho.itens); 
 
  // Inicializa como "Visitante" para garantir que algo apareça
  const [nomeUsuario, setNomeUsuario] = useState('Visitante');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.nome) {
          setNomeUsuario(user.nome);
        }
      } catch (error) {
        console.error('Erro ao ler usuário do localStorage:', error);
      }
    }
  }, []);

  const BotaoSair = () => { 
    localStorage.removeItem('user');
    alert("Deseja sair da página?");
    window.location.reload();
  };

  const BotaoAlterarQuantidade = (id: string, novaQuantidade: number) => { 
    dispatch(alterarQuantidade({ id, novaQuantidade }));
  };

  const BotaoRemoverItem = (id: string) => { 
    dispatch(removerItem(id));
  };

  const totalDoCarrinho = itensNoCarrinho.reduce( 
    (acc: number, item: CartItemType) => acc + item.quantidade * item.valor, 
    0
  );

  const BotaoFinalizarCompra = () => {
    if (itensNoCarrinho.length === 0) {
      alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!");
      return;
    }
    alert("Compra finalizada! Total: R$ " + totalDoCarrinho.toFixed(2).replace('.', ','));
  };

  return (
    <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam">
      <Header nomeUsuario={nomeUsuario} encerrarSessao={BotaoSair} />

      <main className="relative flex-grow p-5 pb-24 max-w-5xl mx-auto my-5 bg-rose-300 rounded-lg shadow-lg w-full"> 
        <h1 className="text-3xl md:text-4xl font-adlam text-amber-900 text-center mb-6 py-4">Carrinho de Compras</h1>

        <div className="space-y-4">
          {itensNoCarrinho.length === 0 ? (
            <p className="text-center text-lg font-adlam text-amber-900 mt-10">Seu carrinho está vazio.</p>
          ) : (
            itensNoCarrinho.map((item: CartItemType) => ( 
              <CartItem
                key={item.id}
                nomeProduto={item.nome}
                quantidade={item.quantidade}
                valorUnitario={item.valor} 
                mudarQuantidade={(novaQuantidade) => BotaoAlterarQuantidade(item.id, novaQuantidade)}
                removerItem={() => BotaoRemoverItem(item.id)}
              />
            ))
          )}
        </div>

        <CartSummary total={totalDoCarrinho} /> 

        <div className="flex justify-center mt-6">
          <button
            onClick={BotaoFinalizarCompra}
            className="w-full max-w-xs bg-gray-800 text-rose-200 font-adlam px-6 py-3 text-lg rounded-md shadow-lg hover:bg-gray-900 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out" 
          >
            Finalizar Compra
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PaginaCarrinho;