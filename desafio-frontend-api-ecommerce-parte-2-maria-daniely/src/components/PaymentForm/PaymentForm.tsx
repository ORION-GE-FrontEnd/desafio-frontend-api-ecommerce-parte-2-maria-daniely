import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

interface Usuario {
  nome: string;
}

const paymentSchema = yup.object({
  formaPagamento: yup.string().required("Selecione uma forma de pagamento"),
  endereco: yup
    .string()
    .required("Endereço é obrigatório")
    .min(5, "Endereço deve ter pelo menos 5 caracteres"),
  numeroComplemento: yup.string().required("Número/Complemento é obrigatório"),
});

type PaymentFormData = yup.InferType<typeof paymentSchema>;

const PaymentForm = () => {
  const [nomeUsuario, setNomeUsuario] = useState("Visitante");

  // Função local para logout
  const encerrarSessao = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user: Usuario = JSON.parse(userData);
        if (user?.nome) setNomeUsuario(user.nome);
      } catch (error) {
        console.error("Erro ao ler usuário do localStorage:", error);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
  });

  const formaSelecionada = watch("formaPagamento");

  const onSubmit = (data: PaymentFormData) => {
    console.log("Dados enviados:", data);
    alert("Pagamento realizado com sucesso!");
  };

  const formasPagamento = [
    { id: "pix", label: "Pix", imgSrc: "./src/assets/Pix.png", alt: "Pix" },
    {
      id: "cartão",
      label: "Cartão",
      imgSrc: "./src/assets/Card Security.png",
      alt: "Cartão",
    },
    {
      id: "boleto",
      label: "Boleto Bancário",
      imgSrc: "./src/assets/Voucher.png",
      alt: "Boleto Bancário",
    },
  ];

  const inputBaseStyle =
    "w-full bg-transparent border-b-2 text-amber-900 placeholder-amber-900 focus:outline-none py-2 font-adlam";

  return (
    <div className="bg-rose-300 min-h-screen w-full flex flex-col">
      <Header nomeUsuario={nomeUsuario} encerrarSessao={encerrarSessao} />

      <h1 className="text-center font-adlam text-3xl md:text-4xl text-amber-900 py-10 px-4">
        Forma de Pagamento
      </h1>

      <main className="bg-amber-50 shadow-lg rounded-xl px-6 py-8 w-full max-w-2xl mx-auto">
        <h2 className="text-center font-adlam text-2xl text-gray-800 mb-6">
          Selecione sua forma de pagamento
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-2">
            {formasPagamento.map(({ id, label, imgSrc, alt }) => (
              <label
                key={id}
                className="bg-gray-800 w-full sm:w-32 h-32 rounded-lg text-white flex flex-col justify-center items-center cursor-pointer border-2 border-transparent peer-checked:border-amber-400 peer-checked:bg-gray-700"
              >
                <input
                  type="radio"
                  value={id}
                  {...register("formaPagamento")}
                  className="hidden peer"
                />
                <img src={imgSrc} alt={alt} className="max-h-16 mb-2" />
                <p className="text-center text-sm md:text-base">{label}</p>
              </label>
            ))}
          </div>

          {formaSelecionada && (
            <p className="text-gray-800 font-adlam text-center mb-4 text-sm md:text-base">
              Você escolheu a forma{" "}
              <span className="capitalize">{formaSelecionada}</span> de pagamento.
            </p>
          )}

          {errors.formaPagamento && (
            <p className="text-red-600 text-sm text-center">
              {errors.formaPagamento.message}
            </p>
          )}

          <div>
            <input
              type="text"
              placeholder="Endereço"
              className={`${inputBaseStyle} ${
                errors.endereco ? "border-red-600" : "border-amber-900"
              }`}
              {...register("endereco")}
            />
            {errors.endereco && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.endereco.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Número/Complemento"
              className={`${inputBaseStyle} ${
                errors.numeroComplemento ? "border-red-600" : "border-amber-900"
              }`}
              {...register("numeroComplemento")}
            />
            {errors.numeroComplemento && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.numeroComplemento.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-rose-200 font-adlam px-6 py-3 text-lg rounded hover:bg-gray-700 transition-colors"
          >
            Confirmar Pedido
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentForm;