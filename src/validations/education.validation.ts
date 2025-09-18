import * as yup from "yup";
import { methodToValidateSelectEmpty } from "../constants/global.constants";
import type { SelectOption } from "@/types/main.types";


export const validationNewEducationForm = yup.object().shape({
    institution: yup.string().required("Instituição é obrigatória"),
    course: yup.string().required("Curso é obrigatório"),
    startDate: yup.string().required("Data de início é obrigatória"),
    endDate: yup.string().required("Data de término é obrigatória"),
    educationStatus: yup
        .object<SelectOption>()
        .test(
            "validate-option",
            "Status da educação é obrigatório",
            methodToValidateSelectEmpty
        ),

});
