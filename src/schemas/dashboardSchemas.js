import { z } from 'zod';

// Regex para validação de data simples no formato YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const getRegistroPedagogicoSchema = z.object({
  query: z.object({
    dataInicio: z
      .string()
      .regex(dateRegex, { message: 'dataInicio deve estar no formato YYYY-MM-DD' })
      .optional(),
    
    dataFim: z
      .string()
      .regex(dateRegex, { message: 'dataFim deve estar no formato YYYY-MM-DD' })
      .optional(),

    // Aceita o ID do curso vindo da URL/Query (ex: ?idCurso=4) e converte para número
    idCurso: z
      .coerce
      .number({ message: 'idCurso deve ser um número válido' })
      .positive()
      .optional(),

    // Aceita busca por nome do curso ou tipo
    curso: z
      .string()
      .min(1, { message: 'curso não pode ser uma string vazia' })
      .optional(),

    // Tipos de relatórios reais do relatorioService
    tipo: z
      .enum(['atendimento_geral', 'acompanhamento_pedagogico'], {
        errorMap: () => ({ message: "tipo deve ser 'atendimento_geral' ou 'acompanhamento_pedagogico'" })
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Regra 1: Se dataInicio for informado, dataFim passa a ser obrigatório
      if (data.dataInicio && !data.dataFim) {
        return false;
      }
      return true;
    },
    {
      message: 'dataFim é obrigatório quando dataInicio for enviado',
      path: ['dataFim'],
    }
  )
  .refine(
    (data) => {
      // Regra 2: dataFim não pode ser menor que dataInicio
      if (data.dataInicio && data.dataFim) {
        return new Date(data.dataFim) >= new Date(data.dataInicio);
      }
      return true;
    },
    {
      message: 'dataFim deve ser igual ou posterior a dataInicio',
      path: ['dataFim'],
    }
  )
});
