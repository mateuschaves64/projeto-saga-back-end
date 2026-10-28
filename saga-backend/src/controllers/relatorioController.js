import { relatorioService } from "../services/relatorioService.js";

// POST /relatorio/registro_pedagogico
export const criarRegistro = async (req, res) => {
  try {
    const dados = req.body;

    // Se o id_usuario_fk não vier no body, utiliza o ID extraído pelo authMiddleware (req.user)
    if (!dados.id_usuario_fk && req.user?.id) {
      dados.id_usuario_fk = req.user.id;
    }

    const novoRegistro = await relatorioService.criarRegistro(dados);

    // Contrato: Retorna 201 Created
    return res.status(201).json(novoRegistro);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor ao criar relatório" });
  }
};

// PATCH /relatorio/registro_pedagogico/:id
export const atualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const registroAtualizado = await relatorioService.atualizarRegistro(id, dados);

    if (!registroAtualizado) {
      // Contrato: Retorna 404 se o ID não for encontrado no mock
      return res.status(404).json({ message: "Relatório pedagógico não encontrado" });
    }

    // Contrato: Retorna 200 OK
    return res.status(200).json(registroAtualizado);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor ao atualizar relatório" });
  }
};