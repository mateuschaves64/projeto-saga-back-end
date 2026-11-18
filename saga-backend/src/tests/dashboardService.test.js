import { jest } from '@jest/globals';
import { prismaMock } from './helpers/prismaMock.js';

jest.unstable_mockModule('../../db.js', () => ({ default: prismaMock }));

const { dashboardService } = await import('../services/dashboardService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

// Atalho: argumentos da 1ª chamada ao findMany
const consulta = () => prismaMock.registro_pedagogico.findMany.mock.calls[0][0];

describe('dashboardService', () => {
  // GET /dashboard/registro_pedagogico
  describe('buscarDashboard', () => {
    beforeEach(() => {
      prismaMock.registro_pedagogico.findMany.mockResolvedValue([]);
    });

    it('sem filtros, usa where vazio, include e ordenação por data', async () => {
      await dashboardService.buscarDashboard();

      expect(prismaMock.registro_pedagogico.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          curso: true,
          usuario: {
            select: { id_usuario_pk: true, nome_completo: true, email_usu: true },
          },
        },
        orderBy: { data_inicial: 'desc' },
      });
    });

    it('filtra por tipo_relatorio', async () => {
      await dashboardService.buscarDashboard({ tipo_relatorio: 'atendimento_geral' });

      expect(consulta().where).toEqual({ tipo_relatorio: 'atendimento_geral' });
    });

    it('filtra por id_curso_fk convertendo para número', async () => {
      await dashboardService.buscarDashboard({ id_curso_fk: '4' });

      expect(consulta().where).toEqual({ id_curso_fk: 4 });
    });

    // Enum válido: busca por nome E por tipo_curso
    it('inclui tipo_curso no filtro quando o valor é um enum válido', async () => {
      await dashboardService.buscarDashboard({ curso: 'tecnico' });

      expect(consulta().where).toEqual({
        curso: {
          OR: [{ nome_curso: { contains: 'tecnico' } }, { tipo_curso: 'tecnico' }],
        },
      });
    });

    // Valor fora do enum: busca só por nome (evita erro do Prisma)
    it('busca só por nome quando o valor não é um enum válido', async () => {
      await dashboardService.buscarDashboard({ curso: 'Informática' });

      expect(consulta().where.curso.OR).toEqual([
        { nome_curso: { contains: 'Informática' } },
      ]);
    });

    it('filtra por intervalo de datas quando inicial e final são informadas', async () => {
      await dashboardService.buscarDashboard({
        data_inicial: '2026-01-01',
        data_final: '2026-01-31',
      });

      expect(consulta().where.data_inicial).toEqual({
        gte: new Date('2026-01-01'),
        lte: new Date('2026-01-31'),
      });
    });

    it('ignora o filtro de data se só uma das datas for informada', async () => {
      await dashboardService.buscarDashboard({ data_inicial: '2026-01-01' });

      expect(consulta().where).not.toHaveProperty('data_inicial');
    });

    it('combina vários filtros', async () => {
      await dashboardService.buscarDashboard({
        tipo_relatorio: 'acompanhamento_pedagogico',
        id_curso_fk: 2,
      });

      expect(consulta().where).toEqual({
        tipo_relatorio: 'acompanhamento_pedagogico',
        id_curso_fk: 2,
      });
    });
  });

  // Token do "Lembrar-me" (duplicado no authService)
  describe('salvarTokenLembrarMe', () => {
    it('salva um token no formato esperado', async () => {
      prismaMock.usuario.update.mockResolvedValue({ id_usuario_pk: 5 });

      await dashboardService.salvarTokenLembrarMe('5');

      const { where, data } = prismaMock.usuario.update.mock.calls[0][0];
      expect(where).toEqual({ id_usuario_pk: 5 });
      expect(data.token_lembrar_me).toMatch(/^tk_lembrar_5_\d+$/);
    });

    it('retorna null se o usuário não existir (P2025)', async () => {
      prismaMock.usuario.update.mockRejectedValue({ code: 'P2025' });

      expect(await dashboardService.salvarTokenLembrarMe(99)).toBeNull();
    });

    it('repassa outros erros', async () => {
      prismaMock.usuario.update.mockRejectedValue(new Error('erro de conexão'));

      await expect(dashboardService.salvarTokenLembrarMe(1)).rejects.toThrow('erro de conexão');
    });
  });
});