import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useQuery, gql } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Interface para o item do pedido
interface PedidoItem {
  name: string;
  quantity: number;
  price: number;
}

// Interface para o Pedido
interface Pedido {
  orderId: string;
  items: PedidoItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  address: string;
}

// Query GraphQL para buscar os dados do pedido
const GET_PEDIDOS = gql`
  query GetPedidos {
    pedidos {
      orderId
      items {
        name
        quantity
        price
      }
      totalAmount
      status
      paymentMethod
      address
    }
  }
`;

const OrderSummary: React.FC = () => {
  const navegar = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [nomeDeUsuario, setNomeDeUsuario] = useState('Visitante');
  const [pedidoFoiFinalizado, setPedidoFoiFinalizado] = useState(false);
  const [numeroDoPedidoGerado, setNumeroDoPedidoGerado] = useState('');

  const { loading, error, data } = useQuery<{ pedidos: Pedido[] }>(GET_PEDIDOS);

  useEffect(() => {
    const dadosDoUsuario = localStorage.getItem('user');
    if (dadosDoUsuario) {
      try {
        const usuario = JSON.parse(dadosDoUsuario);
        if (usuario && usuario.nome) {
          setNomeDeUsuario(usuario.nome);
        }
      } catch (erro) {
        console.error('Erro ao ler dados do usuário do localStorage:', erro);
      }
    }

    const orderIdDaRota = location.state?.orderId;
    if (orderIdDaRota && data?.pedidos) {
      const pedidoEncontrado = data.pedidos.find((pedido) => pedido.orderId === orderIdDaRota);
      if (pedidoEncontrado) {
        setNumeroDoPedidoGerado(pedidoEncontrado.orderId);
        setPedidoFoiFinalizado(true);
      }
    }
  }, [data, location.state]);

  const BotaoSair = () => {
    logout();
    alert("Deseja sair da página?");
    window.location.reload();
  };

  const BotaoVoltarParaInicio = () => {
    navegar('/home');
  };

  if (loading) return <p className="text-center">Carregando resumo do pedido...</p>;
  if (error) return <p className="text-center">Erro ao carregar o resumo do pedido.</p>;
  
  const orderIdDaRota = location.state?.orderId;
  const pedido = data?.pedidos.find((p) => p.orderId === orderIdDaRota);

  if (!orderIdDaRota || !pedido) return <p className="text-center">Nenhum pedido encontrado.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-rose-300 text-amber-900 font-adlam">
      <Header nomeUsuario={nomeDeUsuario} encerrarSessao={BotaoSair} />

      <h1 className="text-center font-adlam text-3xl md:text-4xl text-amber-900 py-10 px-4">
        Resumo do Pagamento
      </h1>

      {pedidoFoiFinalizado ? (
        <main className="bg-amber-50 shadow-lg rounded-xl px-4 py-6 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-adlam text-amber-900 mb-6">
            Pedido realizado com sucesso!
          </h1>
          <p className="text-base sm:text-lg text-gray-800 mb-4">
            {`Número do Pedido: ${numeroDoPedidoGerado}`}
          </p>
          <p className="text-base sm:text-lg text-gray-800 mb-8">
            Obrigado por sua compra!
          </p>
          <button
            onClick={BotaoVoltarParaInicio}
            className="w-full bg-gray-800 text-rose-200 font-adlam px-4 py-2 sm:px-6 sm:py-3 text-lg rounded hover:bg-gray-700 transition-colors"
          >
            Voltar para o Início
          </button>
        </main>
      ) : (
        <main className="bg-amber-50 shadow-lg rounded-xl p-6 sm:p-8 md:p-10 w-full max-w-2xl mx-auto mt-4 sm:mt-10 pb-28 sm:pb-36 md:pb-48">
          <p className="text-gray-800 text-sm sm:text-base mb-6">
            Por favor, verifique as informações antes de finalizar o pagamento
          </p>
          <div className="space-y-4 sm:space-y-6 text-left">
            <div>
              <label className="block text-amber-900 font-bold text-sm sm:text-base mb-1">Nome do(s) Produto(s)</label>
              <ul className="list-disc list-inside">
                {pedido.items.map((item: PedidoItem) => (
                  <li key={item.name}>{item.name} (x{item.quantity})</li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-amber-900 font-bold text-sm sm:text-base mb-1">Quantidade Total de Itens</label>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 py-2 font-adlam"
                value={pedido.items.reduce((soma: number, item: PedidoItem) => soma + item.quantity, 0) + " itens"}
              />
            </div>
            <div>
              <label className="block text-amber-900 font-bold text-sm sm:text-base mb-1">Forma de Pagamento</label>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 py-2 font-adlam"
                value={pedido.paymentMethod || "Não informada"}
              />
            </div>
            <div>
              <label className="block text-amber-900 font-bold text-sm sm:text-base mb-1">Endereço de Entrega</label>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 py-2 font-adlam"
                value={pedido.address || "Não informado"}
              />
            </div>
            <div className="text-right text-xl sm:text-2xl font-bold font-adlam text-amber-900 mt-6 pt-4 border-t border-amber-200">
              Total do Pedido: R$ {pedido.totalAmount.toFixed(2).replace('.', ',')}
            </div>
            <button
              onClick={BotaoVoltarParaInicio}
              type="button"
              className="w-full bg-gray-800 text-rose-200 font-adlam px-4 py-2 sm:px-6 sm:py-3 text-lg rounded hover:bg-gray-700 transition-colors mt-6 sm:mt-8"
            >
              Voltar para o Início
            </button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default OrderSummary;