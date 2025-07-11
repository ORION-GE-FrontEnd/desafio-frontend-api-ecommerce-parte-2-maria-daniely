import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PropsHeader {
  nomeUsuario?: string;
  encerrarSessao?: () => void;
}

const Header: React.FC<PropsHeader> = ({ nomeUsuario = "Daniely", encerrarSessao }) => {
  const navegar = useNavigate();

  const irParaCarrinho = () => {
    navegar('/carrinho');
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-amber-50 border-b border-amber-200 text-amber-900 shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold font-adlam text-amber-900"> OrionStore 🛒</span>
      </div>

      <div className="flex items-center gap-2 text-lg font-adlam text-amber-900">
        <span>Bem-vindo (a), {nomeUsuario}!</span>
        
        <button
          onClick={irParaCarrinho}
          className="bg-transparent border-none cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out
                     hover:scale-110 hover:text-amber-950"
          aria-label="Ir para o carrinho de compras"
        >
          <img src="/src/assets/carrinhoShoping.svg" alt="Ícone do Carrinho" className="w-7 h-7" /> 
        </button>
      </div>

      <div className="flex items-center gap-5">
        {encerrarSessao && (
          <button 
            onClick={encerrarSessao} 
            
            className="bg-transparent border-none text-amber-900 cursor-pointer flex items-center gap-1 font-adlam 
                       transition-all duration-200 ease-in-out hover:scale-110 hover:text-amber-950" 
          >
             Sair 
            <img src="/src/assets/sair.svg" alt="Ícone de Sair" className="w-7 h-7" /> 
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;