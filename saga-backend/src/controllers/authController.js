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
    // 1. Pega os dados enviados no req.body
    const { email, senha, lembrarMe = false } = req.body;

    // 2. Busca o usuário no Service (array de mock)
    const user = await relatorioService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // 3. O bcrypt compara a senha digitada com o hash salvo
    const isPasswordValid = await bcrypt.compare(senha, user.senha_usu);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // 4. Trata a flag de "Lembrar-me" se for true
    if (lembrarMe) {
      await relatorioService.salvarTokenLembrarMe(user.id_usuario_pk);
    }

    // 5. Gera o token JWT com o payload definido no contrato (id e email)
    const token = jwt.sign(
      { id: user.id_usuario_pk, email: user.email_usu }, 
      process.env.JWT_SECRET || "chave_secreta",
      { expiresIn: '8h' }
    );

    // 6. Separa a senha antes de devolver os dados públicos
    const { senha_usu: _, ...dadosPublicos } = user;

    // Conforme o Contrato: Retorna 200 OK com token e dados públicos do usuário
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
    // 1. Extrai o cabeçalho Authorization da requisição
    const authHeader = req.headers.authorization;

    // 2. Se o header não existir ou não começar com "Bearer ", retorna 401 Unauthorized
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Token não fornecido ou em formato inválido" });
    }

    // 3. Pega apenas a string do token (separando "Bearer" do hash do token)
    const token = authHeader.split(' ')[1];

    // 4. Envia o token para o Service invalidá-lo (adicionando na blacklist)
    await relatorioService.logout(token);

    // 5. Retorna status 200 OK (ou 204 No Content sem corpo no JSON)
    return res.status(200).json({ message: "Logout realizado com sucesso" });

  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};