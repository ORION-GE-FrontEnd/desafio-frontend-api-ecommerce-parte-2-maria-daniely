import React from 'react';

interface PropsProductCard {
  urlImagem?: string;
  nomeProduto: string;
  valor: number;
  adicionarAoCarrinho: () => void;
}

const ProductCard: React.FC<PropsProductCard> = ({ urlImagem, nomeProduto, valor, adicionarAoCarrinho }) => {
  return (
    <div className="bg-amber-50 rounded-lg p-4 text-center shadow-md flex flex-col items-center gap-3 w-52 min-h-[280px] box-border">
      <div className="w-full h-32 bg-gray-300 rounded-md flex justify-center items-center overflow-hidden"> 
        {urlImagem ? (
          <img src={urlImagem} alt={nomeProduto} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold font-adlam text-black">Foto</span> 
        )}
      </div>
      <h3 className="text-lg font-semibold font-adlam text-black mt-2">{nomeProduto}</h3>
      <p className="text-xl font-bold font-adlam text-amber-900">
        R$ {valor.toFixed(2).replace('.', ',')} 
      </p>
      <button
        className="bg-gray-800 text-rose-200 font-adlam rounded-[20px] px-4 py-2 cursor-pointer flex items-center gap-2 text-sm font-bold transition-colors hover:bg-gray-300" 
        onClick={adicionarAoCarrinho}
      >
        <img src="/src/assets/carrinho-de-compras.svg" alt="Adicionar ao carrinho" className="w-7 h-5" />
        Adicionar ao carrinho
      </button>
    </div>
  );
};

export default ProductCard;