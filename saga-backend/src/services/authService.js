  // --------------------------------------------------
  // 1. AUTENTICAÇÃO E USUÁRIOS
  // --------------------------------------------------

// GET /usuarios
// async buscarTodosUsuarios() {
//   return usuarios.map(({ senha_usu, token_lembrar_me, ...dadosPublicos }) => dadosPublicos);
// },

  // POST /auth/login
  // async login(email, senha, lembrarMe = false) {
  //   const usuario = usuarios.find(u => u.email_usu === email);

  //   if (!usuario) return null;

  //   // Simula a geração do token de "lembrar minha senha"
  //   if (lembrarMe) {
  //     usuario.token_lembrar_me = `tk_lembrar_${usuario.id_usuario_pk}_${Date.now()}`;
  //   }

  //   const token = `mock_jwt_token_${usuario.id_usuario_pk}_${Date.now()}`;
  //   const { senha_usu, ...dadosPublicos } = usuario;

  //   return {
  //     token,
  //     usuario: dadosPublicos
  //   };
  // },

  // POST /auth/register
  // async registrarUsuario({ email_usu, senha_usu, nome_completo }) {
  //   const emailExiste = usuarios.some(u => u.email_usu === email_usu);
  //   if (emailExiste) {
  //     const error = new Error("E-mail já cadastrado");
  //     error.status = 409;
  //     throw error;
  //   }

  //   const novoUsuario = {
  //     id_usuario_pk: usuarios.length + 1,
  //     nome_completo,
  //     email_usu,
  //     senha_usu,
  //     preferencia_tema: false, // Light mode por padrão
  //     preferencia_contraste: false, // Contraste normal por padrão
  //     token_lembrar_me: null
  //   };

  //   usuarios.push(novoUsuario);

  //   const { senha_usu: _, ...dadosPublicos } = novoUsuario;
  //   return dadosPublicos;
  // },

  // Busca o usuário pelo e-mail
  // async findUserByEmail(email) {
  //   const usuario = usuarios.find(u => u.email_usu === email);
  //   return usuario || null;
  // },

  // POST /auth/logout
  // async logout(token) {
  //   if (token) {
  //     tokensBlacklist.add(token);
  //   }
  //   return true;
  // },

  // PATCH /usuario/configuracoes (Dark mode e Alto contraste)
  // async atualizarPreferencias(idUsuario, { preferencia_tema, preferencia_contraste }) {
  //   const usuario = usuarios.find(u => u.id_usuario_pk === Number(idUsuario));
  //   if (!usuario) return null;

  //   if (preferencia_tema !== undefined) usuario.preferencia_tema = preferencia_tema;
  //   if (preferencia_contraste !== undefined) usuario.preferencia_contraste = preferencia_contraste;

  //   const { senha_usu, ...dadosPublicos } = usuario;
  //   return dadosPublicos;
  // },