import * as yup from "yup";

import { methodToValidateSelectEmpty } from "../constants/global.constants";

export const validationRegisterForm = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  contact: yup
    .string()
    .matches(/^\d{10,11}$/, "Contato deve ter 10 ou 11 dígitos")
    .required("Contato é obrigatório"),
  cep: yup
    .string()
    .matches(/^\d{5}-?\d{3}$/, "CEP inválido, formato esperado: 00000-000")
    .required("CEP é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  state: yup
    .object()
    .test(
      "validate-option",
      "Estado é o obrigatório",
      methodToValidateSelectEmpty
    ),
  street: yup.string().required("Endereço é obrigatório"),
  number: yup.string().required("Número é obrigatório"),
  neighborhood: yup.string().required("Bairro é obrigatório"),
  date_birth: yup.string().required("Data de nascimento é obrigatória"),
  genre: yup
    .object()
    .test(
      "validate-genre",
      "Gênero é obrigatório",
      methodToValidateSelectEmpty
    ),
  education: yup
    .object()
    .test(
      "validate-education",
      "Escolaridade é obrigatória",
      methodToValidateSelectEmpty
    )
});
