// Altere a importação para o arquivo de service que você criou (dashboardService.js ou relatorioService.js)
import { dashboardService } from '../services/dashboardService.js';

const TIPOS_RELATORIO_VALIDOS = ['atendimento_geral', 'acompanhamento_pedagogico'];

export const getRegistroPedagogico = async (req, res) => {
  try {
    const { dataInicio, dataFim, curso, tipo, idCurso } = req.query;

    // Validação opcional para evitar erro 500 caso enviem um Enum inválido na query string
    if (tipo && !TIPOS_RELATORIO_VALIDOS.includes(tipo)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: `Tipo de relatório inválido. Valores aceitos: ${TIPOS_RELATORIO_VALIDOS.join(', ')}`
      });
    }

    // Mapeia os parâmetros da requisição para o formato esperado pelo Service
    const dados = await dashboardService.buscarDashboard({
      data_inicial: dataInicio,
      data_final: dataFim,
      curso,
      tipo_relatorio: tipo,
      id_curso_fk: idCurso
    });

    return res.status(200).json({
      sucesso: true,
      filtrosAplicados: { dataInicio, dataFim, curso, tipo, idCurso },
      quantidade: dados.length,
      dados
    });
  } catch (error) {
    console.error('Erro em getRegistroPedagogico:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno no servidor.',
      erro: error.message
    });
  }
};
