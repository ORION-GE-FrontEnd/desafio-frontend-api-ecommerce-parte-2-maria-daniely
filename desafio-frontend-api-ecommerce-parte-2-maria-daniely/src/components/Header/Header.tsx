import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  nomeUsuario: string;
  encerrarSessao: () => void;
}

const Header: React.FC<HeaderProps> = ({ nomeUsuario, encerrarSessao }) => 
{
  const navigate = useNavigate();

  const irParaCarrinho = () => {
    navigate("/carrinho");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    if(encerrarSessao) {
      encerrarSessao();
    }
    navigate("/");
  };

  return (
    <header className="bg-amber-50 text-amber-900 px-4 py-3 flex justify-between items-center shadow-md sm:px-6 md:px-8 lg:px-10"> 
      <h1 className="text-xl sm:text-2xl font-adlam">OrionStore 🛒</h1> 

      <div className="flex items-center gap-3 sm:gap-5"> 
        <p className="hidden sm:block font-adlam text-sm sm:text-base md:text-lg"> 
          Bem-vindo(a), <span className="font-adlam">{nomeUsuario}</span>!
        </p>

        <button
          onClick={irParaCarrinho}
          className="bg-transparent border-none cursor-pointer flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 hover:text-amber-950 p-1 sm:p-2" 
          aria-label="Ir para o carrinho de compras"
        >
          <img
            src="/src/assets/carrinhoShoping.svg"
            alt="Ícone do Carrinho"
            className="w-6 h-6 sm:w-7 sm:h-7" 
          />
        </button>

        <button
          onClick={handleLogout}
          className="bg-transparent border-none text-amber-900 cursor-pointer flex items-center gap-1 font-adlam transition-transform duration-200 ease-in-out hover:scale-110 hover:text-amber-950 text-sm sm:text-base" 
        >
          <span className="hidden sm:inline">Sair</span> 
          <img
            src="/src/assets/sair.svg"
            alt="Ícone de Sair"
            className="w-5 h-5 sm:w-6 sm:h-6" 
          />
        </button>
      </div>
    </header>
  );
};

export default Header;