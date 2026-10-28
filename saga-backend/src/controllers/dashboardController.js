// dashboardController.js
import { relatorioService } from '../services/relatorioService.js';

export const getRegistroPedagogico = async (req, res) => {
  try {
    const { dataInicio, dataFim, curso, tipo, idCurso } = req.query;

    // Mapeia os parâmetros da requisição para o formato esperado pelo relatorioService
    const dados = await relatorioService.buscarDashboard({
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
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno no servidor.',
      erro: error.message
    });
  }
};
