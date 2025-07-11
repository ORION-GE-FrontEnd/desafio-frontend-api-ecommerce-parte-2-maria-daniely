import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import CartItem from '../CartItem/CartItem';    
import CartSummary from '../CartSummary/CartSummary'; 

interface ProdutoNoCarrinho { 
  id: string;
  nome: string; 
  quantidade: number; 
  precoUnitario: number; 
}

const PaginaCarrinho: React.FC = () => { 
  const [itensNoCarrinho, setItensNoCarrinho] = useState<ProdutoNoCarrinho[]>([ 
    { id: 'p4', nome: 'Produto 4', quantidade: 2, precoUnitario: 50.00 },
    { id: 'p3', nome: 'Produto 3', quantidade: 1, precoUnitario: 50.00 },
    { id: 'p2', nome: 'Produto 2', quantidade: 3, precoUnitario: 50.00 },
  ]);

  // Inicializa como "Visitante" para garantir que algo apareça
  const [nomeUsuario, setNomeUsuario] = useState('Visitante');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if(userData) {
      try {
        const user = JSON.parse(userData);
        if(user && user.nome) {
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
    setItensNoCarrinho(prevItens =>
      prevItens.map(item =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const BotaoRemoverItem = (id: string) => { 
    setItensNoCarrinho(prevItens => prevItens.filter(item => item.id !== id));
  };

  const totalDoCarrinho = itensNoCarrinho.reduce( 
    (acc, item) => acc + item.quantidade * item.precoUnitario,
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
          {itensNoCarrinho.map(item => (
            <CartItem 
              key={item.id}
              nomeProduto={item.nome}
              quantidade={item.quantidade}
              valorUnitario={item.precoUnitario} 
              mudarQuantidade={(novaQuantidade) => BotaoAlterarQuantidade(item.id, novaQuantidade)}
              removerItem={() => BotaoRemoverItem(item.id)}
            />
          ))}
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