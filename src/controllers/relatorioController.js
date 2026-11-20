import { relatorioService } from "../services/relatorioService.js";


export const criarRegistro = async (req, res) => {
  try {
    const dados = req.body;

   
    if (!dados.id_usuario_fk && req.user?.id) {
      dados.id_usuario_fk = req.user.id;
    }

    const novoRegistro = await relatorioService.criarRegistro(dados);

    
    return res.status(201).json(novoRegistro);
  } catch (error) {
    console.error("Erro em criarRegistro:", error);

    
    if (error.code === "P2003") {
      return res.status(400).json({ message: "Curso ou usuário informado não existe" });
    }

    return res.status(500).json({ message: "Erro interno no servidor ao criar relatório" });
  }
};


export const atualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: "O ID precisa ser um número inteiro" });
    }

    const registroAtualizado = await relatorioService.atualizarRegistro(id, dados);

    if (!registroAtualizado) {
      
      return res.status(404).json({ message: "Relatório pedagógico não encontrado" });
    }

    
    return res.status(200).json(registroAtualizado);
  } catch (error) {
    console.error("Erro em atualizarRegistro:", error);

    if (error.code === "P2003") {
      return res.status(400).json({ message: "Curso informado não existe" });
    }

    return res.status(500).json({ message: "Erro interno no servidor ao atualizar relatório" });
  }
};