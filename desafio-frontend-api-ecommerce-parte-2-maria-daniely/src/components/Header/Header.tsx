import React from 'react';

interface PropsHeader {
  nomeUsuario?: string;
  encerrarSessao?: () => void;
}

const Header: React.FC<PropsHeader> = ({ nomeUsuario = "Daniely", encerrarSessao}) => {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-amber-50 border-b border-amber-200 text-amber-900 shadow-md">
      <div className="flex items-center gap-2">
    
        <span className="text-2xl font-bold font-adlam text-amber-900"> OrionStore 🛒</span>
      </div>

      <div className="flex items-center gap-2 text-lg font-adlam text-amber-900">
        <span>Bem-vindo (a), {nomeUsuario}!</span>
    
        <img src="/src/assets/carrinhoShoping.svg" alt="carrinho Iconn" className="w-5 h-5 filter invert" /> 
      </div>

      <div className="flex items-center gap-5">
        
        
        {encerrarSessao && (
          <button onClick={encerrarSessao} className="bg-transparent border-none text-amber-900 cursor-pointer text-base flex items-center gap-1 font-adlam transition-colors hover:text-amber-950">
            Sair 
            <img src="/src/assets/sair.svg" alt="Logout Icon" className="w-7 h-6 filter invert" /> 
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;