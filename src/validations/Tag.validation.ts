import * as z from 'zod';

export const tagFormSchema = z.object({
    name: z
        .string()
        .min(3, "O nome da tag deve ter pelo menos 3 caracteres") 
        .max(30, "O nome da tag não pode ter mais de 30 caracteres"), 
});