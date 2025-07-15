import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import type { CartItem } from '../../types/cartTypes';
import { useNavigate } from 'react-router-dom';
import { limparCarrinho } from '../../store/cartSlice';

interface DetalhesDoPedido {
  formaPagamento: string;
  endereco: string;
  numeroComplemento: string;
}

const OrderSummary: React.FC = () => {
  const navegar = useNavigate();
  const despachar = useDispatch();

  const itensDoCarrinhoRedux = useSelector((estado: RootState) => estado.carrinho.itens);

  const [nomeDeUsuario, setNomeDeUsuario] = useState('Visitante');
  const [detalhesDoPedidoLocal, setDetalhesDoPedidoLocal] = useState<DetalhesDoPedido | null>(null);
  const [pedidoFoiFinalizado, setPedidoFoiFinalizado] = useState(false);
  const [numeroDoPedidoGerado, setNumeroDoPedidoGerado] = useState('');

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

    const dadosDoPagamento = localStorage.getItem('paymentDetails');
    if (dadosDoPagamento) {
      try {
        setDetalhesDoPedidoLocal(JSON.parse(dadosDoPagamento));
      } catch (erro) {
        console.error('Erro ao ler detalhes de pagamento do localStorage:', erro);
      }
    }
  }, []);

  const BotaoSair = () => {
    localStorage.removeItem('user');
    alert("Deseja sair da página?");
    window.location.reload();
  };

  const BotaoFinalizarPedido = () => {
    if (!detalhesDoPedidoLocal || itensDoCarrinhoRedux.length === 0) {
      alert("Informações do pedido incompletas ou carrinho vazio. Por favor, volte ao carrinho e finalize a compra.");
      navegar('/carrinho');
      return;
    }

    console.log("Processando pedido...", { itensDoCarrinhoRedux, detalhesDoPedidoLocal });

    const numeroGerado = `#${Math.floor(100000 + Math.random() * 900000)}`;
    setNumeroDoPedidoGerado(numeroGerado);

    despachar(limparCarrinho());
    localStorage.removeItem('paymentDetails');

    setPedidoFoiFinalizado(true);
  };

  const formatarProdutos = (itens: CartItem[]) => {
    return itens.map(item => `${item.nome} (x${item.quantidade}) - R$ ${(item.valor * item.quantidade).toFixed(2).replace('.', ',')}`).join('\n');
  };
  
  const totalDoPedidoFinal = itensDoCarrinhoRedux.reduce(
    (acumulador: number, itemDoCarrinho: CartItem) => acumulador + itemDoCarrinho.quantidade * itemDoCarrinho.valor,
    0
  );

  const BotaoVoltarParaInicio = () => {
    navegar('/home');
  };

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
            {numeroDoPedidoGerado && `Número do Pedido: ${numeroDoPedidoGerado}`}
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
              <textarea
                readOnly
                className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 py-2 font-adlam resize-none overflow-y-auto h-24 sm:h-32 md:h-40"
                rows={itensDoCarrinhoRedux.length > 0 ? itensDoCarrinhoRedux.length : 3}
                value={formatarProdutos(itensDoCarrinhoRedux) || "Nenhum produto no carrinho"}
              />
            </div>

            <div>
              <label className="block text-amber-900 font-bold text-sm sm:text-base mb-1">Quantidade Total de Itens</label>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 py-2 font-adlam"
                value={itensDoCarrinhoRedux.reduce((soma, item) => soma + item.quantidade, 0) + " itens"}
              />
            </div>

            <div>
              <label className="block text-amber-900 font-bold text-sm sm:text-base mb-1">Forma de Pagamento</label>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 py-2 font-adlam"
                value={detalhesDoPedidoLocal?.formaPagamento || "Não informada"}
              />
            </div>

            <div>
              <label className="block text-amber-900 font-bold text-sm sm:text-base mb-1">Endereço de Entrega</label>
              <input
                type="text"
                readOnly
                className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 py-2 font-adlam"
                value={`${detalhesDoPedidoLocal?.endereco || "Não informado"}, ${detalhesDoPedidoLocal?.numeroComplemento || ""}`}
              />
            </div>
            
            <div className="text-right text-xl sm:text-2xl font-bold font-adlam text-amber-900 mt-6 pt-4 border-t border-amber-200">
              Total do Pedido: R$ {totalDoPedidoFinal.toFixed(2).replace('.', ',')}
            </div>

            <button
              onClick={BotaoFinalizarPedido}
              type="button"
              className="w-full bg-gray-800 text-rose-200 font-adlam px-4 py-2 sm:px-6 sm:py-3 text-lg rounded hover:bg-gray-700 transition-colors mt-6 sm:mt-8"
            >
              Finalizar Pedido
            </button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default OrderSummary;