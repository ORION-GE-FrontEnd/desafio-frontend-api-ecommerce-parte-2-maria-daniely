import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Header from '../Header/Header';
import SecaoProduto from '../ProductSection/ProductSection';
import Footer from '../Footer/Footer';
import type { Product } from '../../types/cartTypes';

const GET_PRODUTOS = gql`
  query GetProdutos {
    produtos {
      id
      nome
      valor
      imagemUrl
    }
  }
`;

//query para buscar o carrinho e atualizar a interface após a mutação
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

// mutation para adicionar um produto ao carrinho via BFF
const ADICIONAR_AO_CARRINHO_MUTATION = gql`
  mutation AdicionarAoCarrinho($produtoId: ID!, $quantidade: Int!) {
    adicionarAoCarrinho(produtoId: $produtoId, quantidade: $quantidade) {
      id
      nome
      valor
      quantidade
    }
  }
`;

const HomePage: React.FC = () => {

  const [adicionarAoCarrinho, { loading: mutationLoading, error: mutationError }] = useMutation(ADICIONAR_AO_CARRINHO_MUTATION, {
    refetchQueries: [{ query: GET_CARRINHO }], // Recarrega os dados do carrinho após a adição
  });
  
  const { loading, error, data } = useQuery(GET_PRODUTOS);

  const [nomeUsuario, setNomeUsuario] = useState('Visitante');

  useEffect(() => {
    const userData = localStorage.getItem("user");
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
    localStorage.removeItem("user");
    alert("Sessão encerrada. Você será redirecionado.");
    window.location.reload();
  };

  const BotaoAdicionarAoCarrinho = (produto: Product) => {
    adicionarAoCarrinho({ 
      variables: { produtoId: produto.id, quantidade: 1 },
    }).then(() => {
      alert(`${produto.nome} adicionado ao carrinho!`);
    }).catch((err) => {
      console.error("Erro ao adicionar ao carrinho:", err);
    });
  };

  if (loading || mutationLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam items-center justify-center">
        <p className="text-2xl">Carregando produtos...</p>
      </div>
    );
  }

  if (error || mutationError) {
    return (
      <div className="flex flex-col min-h-screen bg-rose-300 text-red-700 font-adlam items-center justify-center">
        <p className="text-2xl">Erro ao carregar produtos: {error?.message || mutationError?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam">
      <Header nomeUsuario={nomeUsuario} encerrarSessao={BotaoSair} />
      
      <main className="flex-grow px-4 py-5 max-w-7xl mx-auto my-5 bg-rose-300 sm:px-6 md:px-8 lg:px-10"> 
        <SecaoProduto
          titulo="Todos os Produtos"
          produtos={data.produtos}
          adicionarAoCarrinho={BotaoAdicionarAoCarrinho}
        />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;