import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("E-mail inválido")
    .required("Campo obrigatório"),

  password: yup
    .string()
    .required("Campo obrigatório")
    .min(8, "A senha precisa ter, no mínimo, 8 caracteres"),
});

/*
Regras que os dados do login devem seguir
*/