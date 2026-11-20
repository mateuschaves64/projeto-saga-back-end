// --------------------------------------------------
// 1. AUTENTICAÇÃO E USUÁRIOS
// --------------------------------------------------

import prisma from '../../db.js';

const tokensBlacklist = new Set();

export const authService = {
  // GET /usuarios
  async buscarTodosUsuarios() {
    return await prisma.usuario.findMany({
      select: {
        id_usuario_pk: true,
        nome_completo: true,
        email_usu: true,
        preferencia_contraste: true,
        preferencia_tema: true
      }
    });
  },

  // POST /auth/register
  async registrarUsuario({ email_usu, senha_usu, nome_completo }) {
    const emailExiste = await prisma.usuario.findUnique({
      where: { email_usu }
    });

    if (emailExiste) {
      const error = new Error("E-mail já cadastrado");
      error.status = 409;
      throw error;
    }

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome_completo,
        email_usu,
        senha_usu,
        preferencia_tema: false,
        preferencia_contraste: false,
        token_lembrar_me: null
      }
    });

    const { senha_usu: _, ...dadosPublicos } = novoUsuario;
    return dadosPublicos;
  },

  // Busca o usuário pelo e-mail
  async findUserByEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email_usu: email }
    });
  },

  // Salva o Token de "Lembrar-me" no banco
  async salvarTokenLembrarMe(idUsuario) {
    return await prisma.usuario.update({
      where: { id_usuario_pk: Number(idUsuario) },
      data: {
        token_lembrar_me: `tk_lembrar_${idUsuario}_${Date.now()}`
      }
    });
  },

  // POST /auth/logout
  async logout(token) {
    if (token) {
      tokensBlacklist.add(token);
    }
    return true;
  },

  // PATCH /usuario/configuracoes (Dark mode e Alto contraste)
  async atualizarPreferencias(idUsuario, { preferencia_tema, preferencia_contraste }) {
    const dadosAtualizar = {};

    if (preferencia_tema !== undefined) dadosAtualizar.preferencia_tema = preferencia_tema;
    if (preferencia_contraste !== undefined) dadosAtualizar.preferencia_contraste = preferencia_contraste;

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id_usuario_pk: Number(idUsuario) },
      data: dadosAtualizar
    });

    const { senha_usu, ...dadosPublicos } = usuarioAtualizado;
    return dadosPublicos;
  }
};
