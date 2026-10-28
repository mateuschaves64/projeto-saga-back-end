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


    // Ajuste/adicione os valores permitidos do curso conforme o seu ENUM do banco/sistema
    curso: z
      .enum(['MECANICA', 'ELETROTECNICA', 'INFORMATICA', 'EDIFICACOES'])
      .optional(),


    // Tipo de relatório ENUM (A ou B)
    tipo: z
      .enum(['A', 'B'])
      .optional(),
  }).refine(
    (data) => {
      // Regra: Se dataInicio for informado, dataFim passa a ser obrigatório
      if (data.dataInicio && !data.dataFim) {
        return false;
      }
      return true;
    },
    {
      message: 'dataFim é obrigatório quando dataInicio for enviado',
      path: ['dataFim'], // Aponta o erro para o campo dataFim
    }
  )
});
