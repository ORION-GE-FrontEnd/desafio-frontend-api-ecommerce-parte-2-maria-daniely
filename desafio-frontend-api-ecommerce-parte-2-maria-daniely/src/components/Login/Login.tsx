import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../Schemas/loginSchema";
import Footer from "../Footer/Footer";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Dados enviados:", data);
    // lógica de login
  };

  return (
    <div className="bg-rose-300 min-h-screen flex flex-col items-center">
      <h1 className="text-center font-adlam text-3xl md:text-4xl text-amber-900 py-10 px-4">
        OrionStore 🛒
      </h1>

      <main className="bg-amber-50 shadow-lg rounded-xl p-6 w-full max-w-md text-center mx-4 sm:mx-auto mt-4 sm:mt-10">
        <h2 className="text-center font-adlam text-2xl text-amber-900 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo de E-mail */}
          <div>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 placeholder-amber-900 focus:outline-none py-2 font-adlam"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600 text-left text-sm font-adlam mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo de Senha */}
          <div>
            <input
              type="password"
              placeholder="Senha"
              className="w-full bg-transparent border-b-2 border-amber-900 text-amber-900 placeholder-amber-900 focus:outline-none py-2 font-adlam"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600 text-left text-sm font-adlam mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-950 text-pink-400 font-adlam px-6 py-3 text-lg rounded hover:bg-amber-900 transition-colors"
          >
            Login
          </button>
        </form>
      </main>

      <div className="flex items-center justify-center py-10 px-4 text-center">
        <p className="font-adlam text-amber-900">
          Ainda é novo por aqui? Crie sua conta
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Login;