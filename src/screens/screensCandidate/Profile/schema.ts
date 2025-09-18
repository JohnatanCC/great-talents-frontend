import * as yup from 'yup';

export const profileSchema = yup.object({
    personalInfo: yup.object({
        firstName: yup.string().min(2, 'Nome deve ter pelo menos 2 caracteres').required(),
        lastName: yup.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres').required(),
        email: yup.string().email('Email inválido').required(),
        phone: yup.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').required(),
        birthDate: yup.string().optional(),
        location: yup.object({
            city: yup.string().required(),
            state: yup.string().required(),
            country: yup.string().required()
        }).optional()
    }).required(),
    professionalInfo: yup.object({
        title: yup.string().min(2, 'Título profissional é obrigatório').required(),
        summary: yup.string().max(500, 'Resumo deve ter no máximo 500 caracteres').optional(),
        experience: yup.array(yup.object({
            company: yup.string().required(),
            position: yup.string().required(),
            startDate: yup.string().required(),
            endDate: yup.string().optional(),
            description: yup.string().optional(),
            current: yup.boolean().default(false)
        })).optional(),
        skills: yup.array(yup.string()).optional(),
        education: yup.array(yup.object({
            institution: yup.string().required(),
            degree: yup.string().required(),
            field: yup.string().required(),
            startDate: yup.string().required(),
            endDate: yup.string().optional(),
            current: yup.boolean().default(false)
        })).optional()
    }).required(),
    preferences: yup.object({
        desiredSalary: yup.number().optional(),
        workType: yup.string().oneOf(['remote', 'hybrid', 'onsite']).optional(),
        availability: yup.string().oneOf(['immediate', 'two_weeks', 'one_month']).optional()
    }).optional()
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;