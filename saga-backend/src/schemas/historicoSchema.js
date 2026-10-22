import {z} from 'zod';

export const idParamSchema = z.object({
    params: z.object({
        id: z.coerce.number({invalid_type_error: "O ID precisa ser um número"})
        .int("O ID deve ser um número inteiro")
        .positive("O ID deve ser um número positivo"),
    })
});

export const updateHistoricoSchema = z.object({
    params: z.object ({
        id: z.coerce.number({invalid_type_error: "O ID precisa ser um número"})
            .int("O ID deve ser um número inteiro")
            .positive("O ID deve ser um número positivo"),
    }),
    body: z.object({
       tipo_relatorio: z.enum([]).optional(),
        status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"]), 
        { errorMap: () => ({ message: "O status deve ser PENDENTE, EM_ANDAMENTO ou CONCLUIDO" })},

        turno: z.enum(["MANHA", "TARDE", "NOITE"]).optional(), 
        modalidade: z.enum([]).optional(),
        data_inicial: z.string().datetime({message: "A data inicial é obrigatória"}),
        data_conclusao: z.string().datetime().optional(),

        turma: z.string().optional().min(3, "A turma deve ter no mínimo 3 caracteres").max(30, "A turma deve ter no máximo 30 caracteres"),
        tipo_atendimento: z.enum([]).optional(),
        tipo_acao: z.enum([]).optional(),
        tipo_contratacao: z.enum([]).optional(),
        relatorio: z.enum([]).optional(),
        
        pedagogo: z.string.min(2, "O pedagogo deve ter no mínimo 2 caracteres").max(120, "O pedagogo deve ter no máximo 120 caracteres").optional(),
        instrutor_aluno: z.string.min(2, "O instrutor/aluno deve ter no mínimo 2 caracteres").max(120, "O instrutor/aluno deve ter no máximo 120 caracteres").optional(),
        coordenador: z.string.min(2, "O coordenador deve ter no mínimo 2 caracteres").max(120, "O coordenador deve ter no máximo 120 caracteres").optional(),
        docente: z.string().min(2, "O docente deve ter no mínimo 2 caracteres").max(120, "O docente deve ter no máximo 120 caracteres").optional(),
        tratativa_nep: z.string().min(5, "A tratativa do NEP deve ter no mínimo 3 caracteres").max(4096, "A tratativa do NEP deve ter no máximo 4096 caracteres").optional(),
        descricao: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres").max(4096, "A descrição deve ter no máximo 4096 caracteres").optional(),
    })
});
