// relatorioService.js

// ==========================================
// ARRAYS DE MOCK (DADOS EM MEMÓRIA)
// ==========================================

const usuarios = [
  { 
    id_usuario_pk: 1, 
    nome_completo: "Ana Clara Souza", 
    email_usu: "ana.souza@saga.edu.br", 
    senha_usu: "$2b$10$4.aX2G/yO5eWJ5LwX/9vE.o5Y/8m9D.x7C2B1A0z9Y8X7W6V5U4t3S", // Hash válido da senha "123456"
    preferencia_tema: true, 
    preferencia_contraste: false, 
    token_lembrar_me: null 
  },
  { 
    id_usuario_pk: 2, 
    nome_completo: "Bruno Henrique Lima", 
    email_usu: "bruno.lima@saga.edu.br", 
    senha_usu: "$2b$10$4.aX2G/yO5eWJ5LwX/9vE.o5Y/8m9D.x7C2B1A0z9Y8X7W6V5U4t3S", 
    preferencia_tema: false, 
    preferencia_contraste: false, 
    token_lembrar_me: "tk_bruno_9812" 
  }
];

const cursos = [
  { id_curso_pk: 1, nome_curso: "Técnico de/em Eletromecânica", tipo_curso: "tecnico" },
  { id_curso_pk: 2, nome_curso: "Técnico em Administração", tipo_curso: "tecnico" },
  { id_curso_pk: 3, nome_curso: "Técnico em Automação / Automação Industrial", tipo_curso: "tecnico" },
  { id_curso_pk: 4, nome_curso: "Técnico em Desenvolvimento de Sistemas / Sistema", tipo_curso: "tecnico" },
  { id_curso_pk: 5, nome_curso: "Técnico em Edificações", tipo_curso: "tecnico" },
  { id_curso_pk: 6, nome_curso: "Técnico em Eletrotécnica", tipo_curso: "tecnico" },
  { id_curso_pk: 7, nome_curso: "Técnico em Informática / Informática para Internet", tipo_curso: "tecnico" },
  { id_curso_pk: 8, nome_curso: "Técnico em Logística", tipo_curso: "tecnico" },
  { id_curso_pk: 9, nome_curso: "Técnico em Manutenção Automotiva / Automotiva", tipo_curso: "tecnico" },
  { id_curso_pk: 10, nome_curso: "Técnico em Planejamento e Controle da Produção / EAD", tipo_curso: "tecnico" }
];

const registrosPedagogicos = [
  { id_registro_pk: 1, id_usuario_fk: 1, id_curso_fk: 4, tipo_relatorio: "atendimento_geral", status_registro: "finalizado", turno: "manha", modalidade: "presencial", data_inicial: "2025-02-03", data_encerramento: "2025-02-03", data_conclusao: "2025-02-03 11:30:00", turma: "TDS-2501", tipo_atendimento: "acolhimento", tipo_acao: null, tipo_contratacao: null, relatorio: null, pedagogo: "Sofia Ramos", instrutor_aluno: "João Pedro Carvalho", coordenacao: "Ricardo Alves", docente: null, tratativa_nep: "Aluno orientado quanto às normas institucionais.", descricao: "Acolhimento realizado no primeiro dia de aula." },
  { id_registro_pk: 2, id_usuario_fk: 2, id_curso_fk: 8, tipo_relatorio: "atendimento_geral", status_registro: "andamento", turno: "noite", modalidade: "presencial", data_inicial: "2025-02-12", data_encerramento: null, data_conclusao: null, turma: "LOG-2502", tipo_atendimento: "acompanhamento", tipo_acao: null, tipo_contratacao: null, relatorio: null, pedagogo: "Camila Nogueira", instrutor_aluno: "Tiago Fernandes", coordenacao: "Bruno Henrique Lima", docente: null, tratativa_nep: "Acompanhamento periódico do rendimento.", descricao: "Aluno apresentou dificuldade em atividades práticas." },
  { id_registro_pk: 3, id_usuario_fk: 3, id_curso_fk: 2, tipo_relatorio: "acompanhamento_pedagogico", status_registro: "pendente", turno: "manha", modalidade: "ead", data_inicial: "2025-03-01", data_encerramento: null, data_conclusao: null, turma: "ADM-2502", tipo_atendimento: null, tipo_acao: "docente", tipo_contratacao: "rsa", relatorio: "falta_feedback", pedagogo: "Sofia Ramos", instrutor_aluno: null, coordenacao: "Bruno Henrique Lima", docente: "Lucas Oliveira", tratativa_nep: "Aguardando devolutiva do docente.", descricao: "Primeiro contato realizado." }
];

const tokensBlacklist = new Set();

// ==========================================
// MÉTODOS MOCKADOS
// ==========================================

export const relatorioService = {

  // --------------------------------------------------
  // 1. AUTENTICAÇÃO E USUÁRIOS
  // --------------------------------------------------

  // POST /auth/login
  async login(email, senha, lembrarMe = false) {
    const usuario = usuarios.find(u => u.email_usu === email);

    if (!usuario) return null;

    // Simula a geração do token de "lembrar minha senha"
    if (lembrarMe) {
      usuario.token_lembrar_me = `tk_lembrar_${usuario.id_usuario_pk}_${Date.now()}`;
    }

    const token = `mock_jwt_token_${usuario.id_usuario_pk}_${Date.now()}`;
    const { senha_usu, ...dadosPublicos } = usuario;

    return {
      token,
      usuario: dadosPublicos
    };
  },

  // POST /auth/register
  async registrarUsuario({ email_usu, senha_usu, nome_completo }) {
    const emailExiste = usuarios.some(u => u.email_usu === email_usu);
    if (emailExiste) {
      const error = new Error("E-mail já cadastrado");
      error.status = 409;
      throw error;
    }

    const novoUsuario = {
      id_usuario_pk: usuarios.length + 1,
      nome_completo,
      email_usu,
      senha_usu,
      preferencia_tema: false, // Light mode por padrão
      preferencia_contraste: false, // Contraste normal por padrão
      token_lembrar_me: null
    };

    usuarios.push(novoUsuario);

    const { senha_usu: _, ...dadosPublicos } = novoUsuario;
    return dadosPublicos;
  },

  // Busca o usuário pelo e-mail
  async findUserByEmail(email) {
    const usuario = usuarios.find(u => u.email_usu === email);
    return usuario || null;
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
    const usuario = usuarios.find(u => u.id_usuario_pk === Number(idUsuario));
    if (!usuario) return null;

    if (preferencia_tema !== undefined) usuario.preferencia_tema = preferencia_tema;
    if (preferencia_contraste !== undefined) usuario.preferencia_contraste = preferencia_contraste;

    const { senha_usu, ...dadosPublicos } = usuario;
    return dadosPublicos;
  },

  // --------------------------------------------------
  // 2. CURSOS (CATÁLOGO / DROPDOWNS DO FRONT)
  // --------------------------------------------------

  // GET /cursos
  async buscarCursos() {
    return cursos;
  },

  // GET /cursos/:id
  async buscarCursoPorId(id) {
    return cursos.find(c => c.id_curso_pk === Number(id)) || null;
  },

  // --------------------------------------------------
  // 3. TELA DE RELATÓRIO E HISTÓRICO
  // --------------------------------------------------

  // POST /relatorio/registro_pedagogico
  async criarRegistro(dados) {
    const novoRegistro = {
      id_registro_pk: registrosPedagogicos.length + 1,
      data_conclusao: dados.status_registro === "finalizado" ? new Date().toISOString() : null,
      ...dados
    };

    registrosPedagogicos.push(novoRegistro);
    return novoRegistro;
  },

  // PATCH /relatorio/registro_pedagogico/:id
  // PATCH /historico/registro_pedagogico/:id
  async atualizarRegistro(id, dados) {
    const index = registrosPedagogicos.findIndex(r => r.id_registro_pk === Number(id));
    if (index === -1) return null;

    registrosPedagogicos[index] = {
      ...registrosPedagogicos[index],
      ...dados
    };

    return registrosPedagogicos[index];
  },

  // DELETE /historico/registro_pedagogico/:id
  async deletarRegistro(id) {
    const index = registrosPedagogicos.findIndex(r => r.id_registro_pk === Number(id));
    if (index === -1) return false;

    registrosPedagogicos.splice(index, 1);
    return true;
  },

  async buscarRegistroPorId(id) {
    return registrosPedagogicos.find(r => r.id_registro_pk === Number(id)) || null;
  },

  // --------------------------------------------------
  // 4. TELA DE DASHBOARD (ROTA ÚNICA GET COM FILTROS)
  // --------------------------------------------------

  // GET /dashboard/registro_pedagogico
  async buscarDashboard(filtros = {}) {
    const { data_inicial, data_final, id_curso_fk, curso, tipo_relatorio } = filtros;

    return registrosPedagogicos.filter(reg => {
      // Filtro por tipo de relatório ('atendimento_geral' ou 'acompanhamento_pedagogico')
      if (tipo_relatorio && reg.tipo_relatorio !== tipo_relatorio) {
        return false;
      }

      // Filtro por ID do Curso
      if (id_curso_fk && reg.id_curso_fk !== Number(id_curso_fk)) {
        return false;
      }

      // Filtro por Nome/ENUM do Curso usando a lista de cursos
      if (curso) {
        const cursoEncontrado = cursos.find(c => 
          c.nome_curso.toLowerCase().includes(curso.toLowerCase()) || 
          c.tipo_curso === curso
        );
        if (!cursoEncontrado || reg.id_curso_fk !== cursoEncontrado.id_curso_pk) {
          return false;
        }
      }

      // Filtro por intervalo de datas
      if (data_inicial && data_final) {
        const regData = new Date(reg.data_inicial);
        const inicio = new Date(data_inicial);
        const fim = new Date(data_final);

        if (regData < inicio || regData > fim) {
          return false;
        }
      }

      return true;
    });
  },

  async salvarTokenLembrarMe(idUsuario) {
  const usuario = usuarios.find(u => u.id_usuario_pk === Number(idUsuario));
  if (usuario) {
    usuario.token_lembrar_me = `tk_lembrar_${usuario.id_usuario_pk}_${Date.now()}`;
  }
  return usuario;
}
};
