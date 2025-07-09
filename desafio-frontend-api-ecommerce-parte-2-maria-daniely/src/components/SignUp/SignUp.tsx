import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { signUpSchema } from "../../Schemas/signUpSchema";
import Footer from "../Footer/Footer";

type SignUpFormInputs = {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormInputs>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormInputs) => {
    console.log("Dados enviados: ", data);

    setTimeout(() => {
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
    }, 500);
  };

  return (
    <div className="bg-rose-300 min-h-screen flex flex-col items-center px-4 sm:px-6">
      <h1 className="text-center font-adlam text-3xl sm:text-4xl text-amber-900 py-10">
        OrionStore 🛒
      </h1>

      <main className="bg-amber-50 shadow-lg rounded-xl p-6 w-full max-w-md text-center mt-4 sm:mt-10">
        <h2 className="font-adlam text-2xl sm:text-3xl text-amber-900 mb-6">
          Cadastro
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div>
            <input
              type="text"
              placeholder="Nome"
              {...register("nome")}
              className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 placeholder-amber-900 focus:outline-none py-2 font-adlam"
            />
            {errors.nome && (
              <p className="text-red-600 text-sm font-adlam mt-1">
                {errors.nome.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="E-mail"
              {...register("email")}
              className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 placeholder-amber-900 focus:outline-none py-2 font-adlam"
            />
            {errors.email && (
              <p className="text-red-600 text-sm font-adlam mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              {...register("password")}
              className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 placeholder-amber-900 focus:outline-none py-2 font-adlam"
            />
            {errors.password && (
              <p className="text-red-600 text-sm font-adlam mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmar senha"
              {...register("confirmPassword")}
              className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 placeholder-amber-900 focus:outline-none py-2 font-adlam"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm font-adlam mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full sm:w-1/2 bg-rose-300 text-amber-950 font-adlam px-4 py-2 text-base rounded hover:bg-pink-400 transition-colors"
            >
              Voltar
            </button>

            <button
              type="submit"
              className="w-full sm:w-1/2 bg-amber-950 text-pink-400 font-adlam px-4 py-2 text-base rounded hover:bg-amber-900 transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;