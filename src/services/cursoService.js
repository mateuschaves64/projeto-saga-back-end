// src/services/cursoService.js
import prisma from '../../db.js';

export const cursoService = {
  // GET /cursos
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

  // GET /cursos/:id
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