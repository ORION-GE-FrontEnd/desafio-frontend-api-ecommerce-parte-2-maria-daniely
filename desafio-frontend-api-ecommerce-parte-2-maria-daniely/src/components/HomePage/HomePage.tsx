import React from 'react';
import Header from '../Header/Header';
import ProductSection from '../ProductSection/ProductSection';
import Footer from '../Footer/Footer'; 

const todosProdutos = [
  { id: 'p1', nome: 'Produto 1', imagemUrl: '' },
  { id: 'p2', nome: 'Produto 2', imagemUrl: '' },
  { id: 'p3', nome: 'Produto 3', imagemUrl: '' },
  { id: 'p4', nome: 'Produto 4', imagemUrl: '' },
];

const produtosEletronicos = [
  { id: 'e1', nome: 'Produto 5', imagemUrl: '' },
  { id: 'e2', nome: 'Produto 6', imagemUrl: '' },
  { id: 'e3', nome: 'Produto 7', imagemUrl: '' },
  { id: 'e4', nome: 'Produto 8', imagemUrl: '' },
];

const HomePage: React.FC = () => {
  const BotaoSair = () => {
    alert("Usuário deslogado!");
  };//apenas um alerta

  const BotaoAdicionarAoCarrinho = (idProduto: string) => {
    alert(`Produto ${idProduto} adicionado ao carrinho!`);
  }; // apenas um alerta

  return ( 
    <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam">
      <Header nomeUsuario="Daniely" encerrarSessao={BotaoSair} /> 
       <main className="flex-grow p-5 max-w-5xl mx-auto my-5 bg-rose-300">
        <ProductSection
          titulo="Produtos"
          produtos={todosProdutos}
          adicionarAoCarrinho={BotaoAdicionarAoCarrinho}
        />
        <ProductSection
          titulo="Eletrônicos"
          produtos={produtosEletronicos}
          adicionarAoCarrinho={BotaoAdicionarAoCarrinho}
        />
       </main>
      <Footer />
    </div>
  );
};

export default HomePage;