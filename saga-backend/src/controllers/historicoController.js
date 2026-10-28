import { relatorioService } from "../services/relatorioService.js";

// PATCH /historico/registro_pedagogico/:id (Edição extemporânea com trava de 24h)
export const updateHistorico = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    // 1. Busca o registro existente no mock/banco
    const registroExistente = await relatorioService.buscarRegistroPorId(id);

    if (!registroExistente) {
      return res.status(404).json({ message: 'Registro pedagógico não encontrado.' });
    }

    // 2. Trava de 24 horas para edição extemporânea
    const dataCriacao = new Date(registroExistente.data_inicial);
    const agora = new Date();
    const diferencaEmHoras = (agora - dataCriacao) / (1000 * 60 * 60);

    if (diferencaEmHoras > 24) {
      return res.status(403).json({
        message: 'Ação não permitida: o prazo de 24 horas para alteração expirou'
      });
    }

    // 3. Atualiza o registro
    const registroAtualizado = await relatorioService.atualizarRegistro(id, dadosAtualizacao);

    return res.status(200).json(registroAtualizado);

  } catch (error) {
    console.error('Erro em updateHistorico:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o histórico.' });
  }
};

// DELETE /historico/registro_pedagogico/:id (Exclusão por ID)
export const deleteHistorico = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Tenta deletar o registro
    const deletado = await relatorioService.deletarRegistro(id);

    if (!deletado) {
      return res.status(404).json({ message: 'Registro pedagógico não encontrado para exclusão.' });
    }

    // 2. Retorna 204 No Content (Sem corpo na resposta conforme especificação HTTP)
    return res.status(204).send();

  } catch (error) {
    console.error('Erro em deleteHistorico:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao excluir o histórico.' });
  }
};