import * as z from 'zod';

export const benefitsFormSchema = z.object({
    description: z
        .string()
        .min(3, "a descrição do benefício deve ter pelo menos 3 caracteres") 
        .max(500, "a descrição do benefício não pode ter mais de 200 caracteres"),
});