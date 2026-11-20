import { z } from 'zod';

// Schema para rotas que recebem apenas :id na URL (ex: DELETE)
export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ invalid_type_error: "O ID precisa ser um número" })
      .int("O ID deve ser um número inteiro")
      .positive("O ID deve ser um número positivo")
  })
});

// Schema para a atualização extemporânea (PATCH com :id na URL + req.body)
export const updateHistoricoSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ invalid_type_error: "O ID precisa ser um número" })
      .int("O ID deve ser um número inteiro")
      .positive("O ID deve ser um número positivo")
  }),
  body: z.object({
    tipo_relatorio: z.enum(["atendimento_geral", "acompanhamento_pedagogico"]).optional(),
    status_registro: z.enum(["pendente", "andamento", "finalizado"]).optional(),
    turno: z.enum(["manha", "tarde", "noite"]).optional().nullable(),
    modalidade: z.enum(["presencial", "ead", "hibrido"]).optional().nullable(),
    data_inicial: z.string().optional(),
    data_encerramento: z.string().optional().nullable(),
    turma: z.string().min(3, "A turma deve ter no mínimo 3 caracteres").max(30).optional().nullable(),
    tipo_atendimento: z.enum([
      "acolhimento", "acompanhamento", "afastamento_temporario", "advertencia",
      "ambientacao_docente", "aplicacao_de_pesquisa", "apoio_a_coordenacao",
      "atendimento_emergencial", "boas_vindas", "calcado_inadequado",
      "fardamento_inadequado", "intervencao_pedagogica", "miniaula", "na",
      "orientacao_aluno", "orientacao_reuniao_instrutora", "outros", "pais_resp",
      "reuniao", "visita_pedagogica"
    ]).optional().nullable(),
    tipo_acao: z.enum(["acompanhamento_docente_turma", "docente"]).optional().nullable(),
    tipo_contratacao: z.enum(["horista", "mensalista", "rsa"]).optional().nullable(),
    relatorio: z.enum(["na", "arquivado", "andamento", "falta_feedback", "observacoes"]).optional().nullable(),
    pedagogo: z.string().min(2, "O pedagogo deve ter no mínimo 2 caracteres").max(120).optional().nullable(),
    instrutor_aluno: z.string().min(2).max(120).optional().nullable(),
    coordenacao: z.string().min(2).max(120).optional().nullable(),
    docente: z.string().min(2).max(120).optional().nullable(),
    tratativa_nep: z.string().min(3).max(4096).optional().nullable(),
    descricao: z.string().min(5).max(4096).optional().nullable()
  })
});