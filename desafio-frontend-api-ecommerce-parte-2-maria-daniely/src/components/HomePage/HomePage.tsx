import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import SecaoProduto from '../ProductSection/ProductSection';
import Footer from '../Footer/Footer';
import { useDispatch } from 'react-redux';
import { adicionarItem } from '../../store/cartSlice';
import type { Product } from '../../types/cartTypes';

interface ProductAPI {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  imageUrl?: string; 
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  const [produtosCarregados, setProdutosCarregados] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [nomeUsuario, setNomeUsuario] = useState('Visitante');

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setCarregando(true);
        setErro(null);
        const resposta = await fetch('http://localhost:3001/api/products');

        if (!resposta.ok) {
          throw new Error(`Erro HTTP! Status: ${resposta.status}`);
        }

        const dados: ProductAPI[] = await resposta.json();

        const produtosMapeados: Product[] = dados.map(item => ({
          id: String(item.id),
          nome: item.name,
          imagemUrl: item.imageUrl,
          valor: item.price,
        }));

        setProdutosCarregados(produtosMapeados);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setErro("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();

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
    dispatch(adicionarItem(produto));
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  if (carregando) {
    return (
      <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam items-center justify-center">
        <p className="text-2xl">Carregando produtos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col min-h-screen bg-rose-300 text-red-700 font-adlam items-center justify-center">
        <p className="text-2xl">Erro ao carregar produtos: {erro}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam">
      <Header nomeUsuario={nomeUsuario} encerrarSessao={BotaoSair} />

      <main className="flex-grow px-4 py-5 max-w-7xl mx-auto my-5 bg-rose-300 sm:px-6 md:px-8 lg:px-10">
        <SecaoProduto
          titulo="Todos os Produtos"
          produtos={produtosCarregados}
          adicionarAoCarrinho={BotaoAdicionarAoCarrinho}
        />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;