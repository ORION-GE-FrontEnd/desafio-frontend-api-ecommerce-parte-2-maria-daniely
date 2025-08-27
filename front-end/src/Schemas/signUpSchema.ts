import * as yup from "yup";

export const signUpSchema = yup.object({
  nome: yup
    .string()
    .required("Nome obrigatório")
    .min(2, "Nome muito curto"),

  email: yup
    .string()
    .email("E-mail inválido")
    .required("E-mail obrigatório"),

  password: yup
    .string()
    .min(8, "A senha precisa ter, no mínimo, 8 caracteres")
    .required("Senha obrigatória"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirmação de senha obrigatória"),
});

export type SignUpFormInputs = yup.InferType<typeof signUpSchema>;

/* regras o formulario de cadastro */