import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import CartItem from '../CartItem/CartItem';
import CartSummary from '../CartSummary/CartSummary';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import type { CartItem as CartItemType } from '../../types/cartTypes';

//query para buscar os itens do carrinho
const GET_CARRINHO = gql`
  query GetCarrinho {
    carrinho {
      id
      nome
      valor
      quantidade
    }
  }
`;

// mutations para as operações de carrinho
const ALTERAR_QUANTIDADE_MUTATION = gql`
  mutation AlterarQuantidade($produtoId: ID!, $novaQuantidade: Int!) {
    alterarQuantidade(produtoId: $produtoId, novaQuantidade: $novaQuantidade) {
      id
      nome
      valor
      quantidade
    }
  }
`;

const REMOVER_ITEM_MUTATION = gql`
  mutation RemoverDoCarrinho($produtoId: ID!) {
    removerDoCarrinho(produtoId: $produtoId) {
      id
    }
  }
`;

const PaginaCarrinho: React.FC = () => {
  const navegar = useNavigate();

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

  // useQuery para buscar os dados do carrinho do BFF
  const { loading, error, data } = useQuery(GET_CARRINHO);
  const [alterarQuantidade] = useMutation(ALTERAR_QUANTIDADE_MUTATION, {
    refetchQueries: [{ query: GET_CARRINHO }], // Recarrega os dados do carrinho após a mutation
  });
  const [removerItem] = useMutation(REMOVER_ITEM_MUTATION, {
    refetchQueries: [{ query: GET_CARRINHO }], // Recarrega os dados do carrinho após a mutation
  });

  if (loading) return <p className="text-center">Carregando carrinho...</p>;
  if (error) return <p className="text-center">Erro ao carregar o carrinho.</p>;

  //calculo do total do carrinho usando os dados do GraphQL
  const itensNoCarrinho = data?.carrinho || [];
  const totalDoCarrinho = itensNoCarrinho.reduce(
    (acc: number, item: CartItemType) => acc + item.quantidade * item.valor,
    0
  );

  
  const BotaoAlterarQuantidade = (id: string, novaQuantidade: number) => {
    alterarQuantidade({ variables: { produtoId: id, novaQuantidade } });
  };

  const BotaoRemoverItem = (id: string) => {
    removerItem({ variables: { produtoId: id } });
  };

  const BotaoFinalizarCompra = () => {
    if (itensNoCarrinho.length === 0) {
      alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!");
      return;
    }
    navegar('/pagamento');
  };

  return (
    <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam">
      <Header nomeUsuario={nomeUsuario} encerrarSessao={BotaoSair} />

      <main className="relative flex-grow p-4 pb-24 max-w-4xl mx-auto my-5 bg-rose-300 rounded-lg shadow-lg w-full sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-adlam text-amber-900 text-center mb-6 py-4">Carrinho de Compras</h1>

        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {itensNoCarrinho.length === 0 ? (
            <p className="text-center text-base sm:text-lg font-adlam text-amber-900 mt-10">Seu carrinho está vazio.</p>
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

        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
          <button
            onClick={BotaoFinalizarCompra}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-gray-800 text-rose-200 font-adlam px-4 py-2 sm:px-6 sm:py-3 text-lg rounded-md shadow-lg hover:bg-gray-900 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
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