import * as yup from "yup"

export const validationNewCertificationForm = yup.object().shape({
    title: yup.string().min(3,"mínimo de caracteres 3.").max(60, "Nome da instituição deve ter no máximo 60 caracteres").required(),
    issuingOrganization: yup.string().min(3,"mínimo de caracteres 3.").max(60, "O nome do curso deve ter no máximo 60 caracteres").required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    courseType: yup.object().required(),
}).required();
