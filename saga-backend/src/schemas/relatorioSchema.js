import { z } from "zod";

// Enums conforme o banco de dados SQL
const tipoRelatorioEnum = z.enum(["atendimento_geral", "acompanhamento_pedagogico"]);
const statusCriacaoEnum = z.enum(["pendente", "andamento"]); // Contrato: criação só aceita pendente ou andamento
const statusAtualizacaoEnum = z.enum(["pendente", "andamento", "finalizado"]);
const turnoEnum = z.enum(["manha", "tarde", "noite"]);
const modalidadeEnum = z.enum(["presencial", "ead", "hibrido"]);
const tipoAtendimentoEnum = z.enum([
  "acolhimento", "acompanhamento", "afastamento_temporario", "advertencia",
  "ambientacao_docente", "aplicacao_de_pesquisa", "apoio_a_coordenacao",
  "atendimento_emergencial", "boas_vindas", "calcado_inadequado",
  "fardamento_inadequado", "intervencao_pedagogica", "miniaula", "na",
  "orientacao_aluno", "orientacao_reuniao_instrutora", "outros", "pais_resp",
  "reuniao", "visita_pedagogica"
]);
const tipoAcaoEnum = z.enum(["acompanhamento_docente_turma", "docente"]);
const tipoContratacaoEnum = z.enum(["horista", "mensalista", "rsa"]);
const relatorioEnum = z.enum(["na", "arquivado", "andamento", "falta_feedback", "observacoes"]);

// Schema de Criação (POST /relatorio/registro_pedagogico)
export const criarRegistroSchema = z.object({
  // CAMPOS OBRIGATÓRIOS
  tipo_relatorio: tipoRelatorioEnum,
  status_registro: statusCriacaoEnum,
  data_inicial: z.string({ required_error: "A data inicial é obrigatória." }),
  pedagogo: z
    .string({ required_error: "O nome do pedagogo é obrigatório." })
    .min(1, "O nome do pedagogo não pode estar vazio.")
    .max(120, "O nome do pedagogo deve ter no máximo 120 caracteres."),

  // Relacionamentos (opcionais na criação se injetados pelo token/user)
  id_usuario_fk: z.number().int().optional(),
  id_curso_fk: z.number().int().optional().nullable(),
  
  // Campos Opcionais / Específicos de Atendimento Geral
  turno: turnoEnum.optional().nullable(),
  modalidade: modalidadeEnum.optional().nullable(),
  data_encerramento: z.string().optional().nullable(),
  turma: z.string().max(30).optional().nullable(),
  tipo_atendimento: tipoAtendimentoEnum.optional().nullable(),
  instrutor_aluno: z.string().max(120).optional().nullable(),
  coordenacao: z.string().max(120).optional().nullable(),
  tratativa_nep: z.string().optional().nullable(),
  descricao: z.string().optional().nullable(),

  // Campos Opcionais / Específicos de Acompanhamento Pedagógico
  tipo_acao: tipoAcaoEnum.optional().nullable(),
  tipo_contratacao: tipoContratacaoEnum.optional().nullable(),
  relatorio: relatorioEnum.optional().nullable(),
  docente: z.string().max(120).optional().nullable()
});

// Schema de Atualização (PATCH /relatorio/registro_pedagogico/:id)
export const atualizarRegistroSchema = z.object({
  tipo_relatorio: tipoRelatorioEnum.optional(),
  status_registro: statusAtualizacaoEnum.optional(),
  data_inicial: z.string().optional(),
  pedagogo: z.string().min(1).max(120).optional(), // Se enviado na edição, valida tamanho mínimo
  id_curso_fk: z.number().int().optional().nullable(),
  turno: turnoEnum.optional().nullable(),
  modalidade: modalidadeEnum.optional().nullable(),
  data_encerramento: z.string().optional().nullable(),
  turma: z.string().max(30).optional().nullable(),
  tipo_atendimento: tipoAtendimentoEnum.optional().nullable(),
  instrutor_aluno: z.string().max(120).optional().nullable(),
  coordenacao: z.string().max(120).optional().nullable(),
  tratativa_nep: z.string().optional().nullable(),
  descricao: z.string().optional().nullable(),
  tipo_acao: tipoAcaoEnum.optional().nullable(),
  tipo_contratacao: tipoContratacaoEnum.optional().nullable(),
  relatorio: relatorioEnum.optional().nullable(),
  docente: z.string().max(120).optional().nullable()
});