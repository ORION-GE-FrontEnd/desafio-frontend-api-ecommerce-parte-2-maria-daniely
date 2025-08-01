import React from 'react';

interface PropsItemCarrinho {
  nomeProduto: string;
  quantidade: number;
  valorUnitario: number;
  mudarQuantidade: (novaQuantidade: number) => void;
  removerItem: () => void;
}

const CartItem: React.FC<PropsItemCarrinho> = ({
  nomeProduto,
  quantidade,
  valorUnitario,
  mudarQuantidade,
  removerItem,
}) => {
  const lidarComMudancaManual = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valorDigitado = parseInt(event.target.value, 10);
    mudarQuantidade(Math.max(1, isNaN(valorDigitado) ? 1 : valorDigitado));
  };

  const lidarComAumento = () => {
    mudarQuantidade(quantidade + 1);
  };

  const lidarComDiminuicao = () => {
    mudarQuantidade(Math.max(1, quantidade - 1));
  };

  const totalDoItem = valorUnitario * quantidade;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-amber-50 p-3 sm:p-4 rounded-lg shadow-sm mb-3 sm:mb-4"> 
      <div className="flex flex-col items-start flex-grow mb-2 sm:mb-0 sm:mr-4"> 
        <span className="text-base sm:text-lg font-adlam text-amber-900">{nomeProduto}</span> 
        <span className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
          R$ {valorUnitario.toFixed(2).replace('.', ',')} cada
        </span>
        <span className="text-sm sm:text-base font-bold text-amber-900">
          Subtotal: R$ {totalDoItem.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 ml-auto sm:ml-0"> 
        <button
          onClick={lidarComDiminuicao}
          className="bg-red-500 text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md font-bold text-lg sm:text-xl hover:bg-red-600 transition-colors"
        > 
          -
        </button>
        <input
          type="number"
          value={quantidade}
          onChange={lidarComMudancaManual}
          min="1"
          className="w-10 h-7 sm:w-12 sm:h-8 text-center border border-amber-900 rounded-md font-adlam text-amber-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-900"
        /> 
        <button
          onClick={lidarComAumento}
          className="bg-green-500 text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md font-bold text-lg sm:text-xl hover:bg-green-600 transition-colors"
        > 
          +
        </button>
      </div>

      <button
        onClick={removerItem}
        className="ml-3 sm:ml-4 bg-red-600 text-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md hover:bg-red-700 transition-colors"
      >
        <img src="/src/assets/lixeiraa.svg" alt="Remover" className="w-5 h-5 sm:w-6 sm:h-6" /> 
      </button>
    </div>
  );
};

export default CartItem;