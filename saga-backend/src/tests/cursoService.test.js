import { jest } from '@jest/globals';
import { prismaMock } from './helpers/prismaMock.js';

// Requer cursoService convertido para import/export (usando ../../db.js)
jest.unstable_mockModule('../../db.js', () => ({ default: prismaMock }));

const { cursoService } = await import('../services/cursoService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('cursoService', () => {
  // GET /cursos
  describe('buscarCursos', () => {
    it('retorna os cursos ordenados por nome', async () => {
      prismaMock.curso.findMany.mockResolvedValue([{ nome_curso: 'A' }, { nome_curso: 'B' }]);

      const resultado = await cursoService.buscarCursos();

      expect(resultado).toHaveLength(2);
      expect(prismaMock.curso.findMany).toHaveBeenCalledWith({
        orderBy: { nome_curso: 'asc' },
      });
    });

    it('lança erro com mensagem padronizada se o banco falhar', async () => {
      prismaMock.curso.findMany.mockRejectedValue(new Error('falha'));

      await expect(cursoService.buscarCursos()).rejects.toThrow(
        'Erro ao listar cursos no banco de dados: falha'
      );
    });
  });

  // GET /cursos/:id
  describe('buscarCursoPorId', () => {
    it('converte o id para número e retorna o curso', async () => {
      prismaMock.curso.findUnique.mockResolvedValue({ id_curso_pk: 3 });

      const resultado = await cursoService.buscarCursoPorId('3');

      expect(resultado).toEqual({ id_curso_pk: 3 });
      expect(prismaMock.curso.findUnique).toHaveBeenCalledWith({
        where: { id_curso_pk: 3 },
      });
    });

    it('retorna null quando o curso não existe', async () => {
      prismaMock.curso.findUnique.mockResolvedValue(null);

      expect(await cursoService.buscarCursoPorId(99)).toBeNull();
    });

    it('lança erro com mensagem padronizada se o banco falhar', async () => {
      prismaMock.curso.findUnique.mockRejectedValue(new Error('falha'));

      await expect(cursoService.buscarCursoPorId(1)).rejects.toThrow(
        'Erro ao buscar curso por ID no banco de dados: falha'
      );
    });
  });
});