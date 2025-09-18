import * as yup from "yup";

// Expressão regular para validar o formato do CNPJ
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;

export const validationNewCompanyForm = yup.object().shape({
    name: yup.string().min(3, "O nome da empresa deve ter pelo menos 3 caracteres").required(),
    company_name: yup.string().min(3, "O nome da empresa deve ter pelo menos 3 caracteres").required(),
    category: yup.object().nullable().required("Categoria é obrigatória"),
    type: yup.object().nullable().required("Tipo é obrigatório"),
    size: yup.object().nullable().required("Tamanho é obrigatório"),
    cnpj: yup.string()
        .matches(cnpjRegex, "CNPJ inválido, formato esperado: 99.999.999/9999-99")  
        .required("CNPJ é obrigatório"),
    email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    description: yup
        .string()
        .min(3, "A descrição deve ter pelo menos 3 caracteres")
        .max(500, "A descrição não pode ter mais de 500 caracteres")
        .required("Descrição é obrigatória"),
    state: yup.object().nullable().required("Estado é obrigatório"),
}).required();
