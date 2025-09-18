import * as yup from "yup";
import { methodToValidateSelectEmpty } from "../constants/global.constants";

export const validationNewExperienceFormationForm = yup
  .object()
  .shape({
    title: yup.string().required("O título é obrigatório."),
    companyName: yup.string().required("O nome da empresa é obrigatório."),
    uf: yup
      .object()
      .test(
        "validate-option",
        "Estado é obrigatório",
        methodToValidateSelectEmpty
      ),
    city: yup.string().required("A cidade é obrigatória."),
    startDate: yup.string().required("A data de início é obrigatória."),
    current: yup.boolean().required("O status atual é obrigatório."),
    description: yup
      .string()
      .max(2500, "A descrição deve ter no máximo 2500 caracteres"),
  })
 
