import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { Product } from '../../types/cartTypes'; 

interface PropsSecaoProduto {
  titulo: string;
  produtos: Product[]; 
  adicionarAoCarrinho: (produto: Product) => void;
}

const SecaoProduto: React.FC<PropsSecaoProduto> = ({ titulo, produtos, adicionarAoCarrinho }) => {
  return (
    <section className="my-8 px-5 py-5 bg-rose-300 rounded-lg shadow-sm">
      <h2 className="text-3xl font-adlam text-black text-center mb-6 pt-5">{titulo}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {produtos.map((produto) => (
          <ProductCard
            key={produto.id}
            id={produto.id}
            nomeProduto={produto.nome}
            urlImagem={produto.imagemUrl}
            valor={produto.valor}
            adicionarAoCarrinho={() => adicionarAoCarrinho(produto)}
          />
        ))}
      </div>
    </section>
  );
};

export default SecaoProduto;