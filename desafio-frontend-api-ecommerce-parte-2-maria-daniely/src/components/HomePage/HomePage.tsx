import React from 'react';
import Header from '../Header/Header';
import SecaoProduto from '../ProductSection/ProductSection';
import Footer from '../Footer/Footer'; 

const todosProdutos = [
  { id: 'p1', nome: 'Produto 1', imagemUrl: '', valor: 50.00 },
  { id: 'p2', nome: 'Produto 2', imagemUrl: '', valor: 50.00 },
  { id: 'p3', nome: 'Produto 3', imagemUrl: '', valor: 50.00 },
  { id: 'p4', nome: 'Produto 4', imagemUrl: '', valor: 50.00 },
];

const produtosEletronicos = [
  { id: 'e1', nome: 'Produto 5', imagemUrl: '', valor: 50.00 },
  { id: 'e2', nome: 'Produto 6', imagemUrl: '', valor: 50.00 },
  { id: 'e3', nome: 'Produto 7', imagemUrl: '', valor: 50.00 },
  { id: 'e4', nome: 'Produto 8', imagemUrl: '', valor: 50.00 },
];

const HomePage: React.FC = () => {
  const BotaoSair = () => {
    alert("Usuário deslogado!");
  };

  const BotaoAdicionarAoCarrinho = (idProduto: string) => {
    alert(`Produto ${idProduto} adicionado ao carrinho!`);
  };

  return ( 
    <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam">
      <Header nomeUsuario="Daniely" encerrarSessao={BotaoSair} /> 
       <main className="flex-grow p-5 max-w-5xl mx-auto my-5 bg-rose-300">
        <SecaoProduto
          titulo="Produtos"
          produtos={todosProdutos}
          adicionarAoCarrinho={BotaoAdicionarAoCarrinho}
        />
        <SecaoProduto
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