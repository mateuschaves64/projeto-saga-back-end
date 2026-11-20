import { z } from "zod";

export const registerSchema = z.object({
    nome_completo: z
      .string({ required_error: 'O nome completo é obrigatório.' })
      .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    
    email_usu: z
    .email('Formato de e-mail inválido.'),
    
    senha_usu: z
      .string({ required_error: 'A senha é obrigatória.' })
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
});


export const loginSchema = z.object({    
    email_usu: z
    .email('Formato de e-mail inválido.'),
    
    senha_usu: z.string({ required_error: 'A senha é obrigatória.' }),

    lembrarMe: z.boolean().optional()
});