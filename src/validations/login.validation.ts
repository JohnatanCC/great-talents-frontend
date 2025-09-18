import * as z from 'zod';

export const LoginFormSchema =  z.object({
    email: z
    .string()
    .email("Digite um email válido"),
    //.isOptional("O email é obrigatório"),
    password: z
    .string()
    //.required("A senha é obrigatório")
})