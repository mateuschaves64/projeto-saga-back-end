import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { relatorioService } from "../services/relatorioService.js";

// Registrar Novo usuário
export const register = async (req, res) => {
    try {
        const { email_usu, senha_usu, nome_completo } = req.body;

        const hashedSenha = await bcrypt.hash(senha_usu, 10);

        const newUser = await relatorioService.registrarUsuario({
            nome_completo,
            email_usu,
            senha_usu: hashedSenha
        });

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno no Servidor" });
    }
};


// Realizar o Login no Site
export const login = async (req, res) => {
  try {
    // Pega os dados enviados no req.body conforme o Zod validou
    const { email_usu, senha_usu, lembrarMe = false } = req.body;

    // Busca o usuário no Service (array de mock)
    const user = await relatorioService.findUserByEmail(email_usu);
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // O bcrypt compara a senha digitada com o hash salvo
    const isPasswordValid = await bcrypt.compare(senha_usu, user.senha_usu);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Trata a flag de "Lembrar-me" se for true
    if (lembrarMe) {
      await relatorioService.salvarTokenLembrarMe(user.id_usuario_pk);
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id_usuario_pk, email: user.email_usu }, 
      process.env.JWT_SECRET || "chave_secreta",
      { expiresIn: '8h' }
    );

    // Separa a senha antes de devolver os dados públicos
    const { senha_usu: _, ...dadosPublicos } = user;

    return res.status(200).json({ 
      token, 
      usuario: dadosPublicos 
    });

  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};


// Realizar o Logout no Site
export const logout = async (req, res) => {
  try {
    // O authMiddleware já garantiu que o token existe e é válido
    const token = req.headers.authorization.split(' ')[1].trim().replace(/^"|"$/g, '');

    // Invalida o token no service
    await relatorioService.logout(token);

    return res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};