
  // --------------------------------------------------
  // 4. TELA DE DASHBOARD (ROTA ÚNICA GET COM FILTROS)
  // --------------------------------------------------

   import prisma from '../../db.js';

// Valores exatos do Enum curso_tipo_curso no seu schema.prisma
   const TIPOS_CURSO_VALIDOS = [
  'tecnico',
  'curso_de_qualificacao_aperfeicoamento_extensao',
  'programas'
  ];

   export const dashboardService = {
  // GET /dashboard/registro_pedagogico
  async buscarDashboard(filtros = {}) {
    const { data_inicial, data_final, id_curso_fk, curso, tipo_relatorio } = filtros;

    const where = {};

    // 1. Filtro por tipo de relatório ('atendimento_geral' ou 'acompanhamento_pedagogico')
    if (tipo_relatorio) {
      where.tipo_relatorio = tipo_relatorio;
    }

    // 2. Filtro por ID do Curso
    if (id_curso_fk) {
      where.id_curso_fk = Number(id_curso_fk);
    }

    // 3. Filtro por Nome ou Enum do Curso na tabela 'curso'
    if (curso) {
      const condicoesCurso = [
        { nome_curso: { contains: curso } }
      ];

      // Só busca no Enum tipo_curso se o valor enviado for um dos aceitos pelo banco
      if (TIPOS_CURSO_VALIDOS.includes(curso)) {
        condicoesCurso.push({ tipo_curso: curso });
      }

      where.curso = {
        OR: condicoesCurso
      };
    }

    // 4. Filtro por intervalo de datas
    if (data_inicial && data_final) {
      where.data_inicial = {
        gte: new Date(data_inicial),
        lte: new Date(data_final)
      };
    }

    // Executa a consulta no MySQL via Prisma
    return await prisma.registro_pedagogico.findMany({
      where,
      include: {
        curso: true, // Traz os dados do curso (nome_curso, tipo_curso)
        usuario: {
          select: {
            id_usuario_pk: true,
            nome_completo: true,
            email_usu: true
          }
        }
      },
      orderBy: {
        data_inicial: 'desc'
      }
    });
  },

  // Salvar token "Lembrar-me"
  async salvarTokenLembrarMe(idUsuario) {
    const token = `tk_lembrar_${idUsuario}_${Date.now()}`;

    try {
      return await prisma.usuario.update({
        where: { id_usuario_pk: Number(idUsuario) },
        data: { token_lembrar_me: token }
      });
    } catch (error) {
      // Se o usuário não existir (P2025), retorna null mantendo o comportamento do .find() original
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
  };