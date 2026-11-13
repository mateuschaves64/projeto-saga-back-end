// src/services/cursoService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Obs.: caso o grupo tenha criado um arquivo central de conexão na branch main (ex: src/database/prisma.js),
// substitua as duas linhas acima por: const prisma = require('../database/prisma');

const cursoService = {
  // Substitui o antigo return cursos; (usado na rota GET /cursos)
  async buscarCursos() {
    try {
      return await prisma.curso.findMany({
        orderBy: {
          nome_curso: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Erro ao listar cursos no banco de dados: ${error.message}`);
    }
  },

  // Substitui o antigo cursos.find(...) (usado na rota GET /cursos/:id)
  async buscarCursoPorId(id) {
    try {
      return await prisma.curso.findUnique({
        where: {
          id_curso_pk: Number(id),
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar curso por ID no banco de dados: ${error.message}`);
    }
  },
};

module.exports = cursoService;
