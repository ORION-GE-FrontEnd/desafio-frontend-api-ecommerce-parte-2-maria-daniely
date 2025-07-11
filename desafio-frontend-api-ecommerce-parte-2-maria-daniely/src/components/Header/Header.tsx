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
    navigate("/login");
  };

  return (
    <header className="bg-amber-50 text-amber-900 px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-adlam">OrionStore 🛒</h1>

      <div className="flex items-center gap-5">
        <p className="hidden sm:block font-adlam">
          Bem-vindo(a), <span className="font-adlam">{nomeUsuario}</span>!
        </p>

        <button
          onClick={irParaCarrinho}
          className="bg-transparent border-none cursor-pointer flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 hover:text-amber-950"
          aria-label="Ir para o carrinho de compras"
        >
          <img
            src="/src/assets/carrinhoShoping.svg"
            alt="Ícone do Carrinho"
            className="w-7 h-7"
          />
        </button>

        <button
          onClick={handleLogout}
          className="bg-transparent border-none text-amber-900 cursor-pointer flex items-center gap-1 font-adlam transition-transform duration-200 ease-in-out hover:scale-110 hover:text-amber-950"
        >
          Sair
          <img
            src="/src/assets/sair.svg"
            alt="Ícone de Sair"
            className="w-6 h-6"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;