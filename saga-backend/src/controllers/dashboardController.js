export const getRegistroPedagogico = async (req, res) => {
  try {
    const { dataInicio, dataFim, curso, tipo } = req.query;


    // Mock de dados para simular o retorno da consulta tratada
    const relatoriosMock = [
      {
        id: 1,
        titulo: 'Relatório de Acompanhamento Didático',
        curso: curso || 'Eletrotécnica',
        tipo: tipo || 'A',
        dataCriacao: dataInicio || '2026-01-15',
        descricao: 'Acompanhamento do progresso de aprendizagem da turma.'
      },
      {
        id: 2,
        titulo: 'Avaliação de Desempenho Prático',
        curso: curso || 'Informatica para internet',
        tipo: tipo || 'B',
        dataCriacao: dataFim || '2026-02-10',
        descricao: 'Registro das notas e frequências práticas.'
      }
    ];


    return res.status(200).json({
      sucesso: true,
      filtrosAplicados: { dataInicio, dataFim, curso, tipo },
      quantidade: relatoriosMock.length,
      dados: relatoriosMock
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno no servidor.',
      erro: error.message
    });
  }
};
