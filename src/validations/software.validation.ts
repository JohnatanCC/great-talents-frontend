import * as yup from "yup"
import { methodToValidateSelectEmpty } from "../constants/global.constants";
import type { SelectOption } from "@/types/main.types";

export const validationNewSoftwareForm = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  level: yup
    .object<SelectOption>()
    .test(
      "validate-option",
      "Nível é o obrigatório",
      methodToValidateSelectEmpty
    ),
});