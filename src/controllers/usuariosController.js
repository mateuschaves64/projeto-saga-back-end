
import { authService } from "../services/authService.js";

// GET /usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await authService.buscarTodosUsuarios();

    return res.status(200).json({
      sucesso: true,
      quantidade: usuarios.length,
      dados: usuarios
    });

  } catch (error) {
    console.error("Erro ao listar usuários:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao listar usuários."
    });
  }
};
''
