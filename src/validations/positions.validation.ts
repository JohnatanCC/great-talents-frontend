import * as z from 'zod';

export const positionsFormSchema = z.object({
    name: z
        .string()
        .min(3, "a descrição do cargo deve ter pelo menos 3 caracteres")
        .max(100, "a descrição do benefício não pode ter mais de 100 caracteres"), 
});