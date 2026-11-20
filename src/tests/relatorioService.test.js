import { jest } from '@jest/globals';
import { prismaMock } from './helpers/prismaMock.js';

jest.unstable_mockModule('../../db.js', () => ({ default: prismaMock }));

const { relatorioService } = await import('../services/relatorioService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('relatorioService', () => {
  describe('criarRegistro', () => {
    it('converte as datas para objetos Date', async () => {
      prismaMock.registro_pedagogico.create.mockResolvedValue({ id_registro_pk: 1 });

      await relatorioService.criarRegistro({
        titulo: 'Teste',
        data_inicial: '2026-01-10',
        data_encerramento: '2026-02-10',
      });

      const { data } = prismaMock.registro_pedagogico.create.mock.calls[0][0];
      expect(data.titulo).toBe('Teste');
      expect(data.data_inicial).toEqual(new Date('2026-01-10'));
      expect(data.data_encerramento).toEqual(new Date('2026-02-10'));
    });

    it('mantém as datas vazias quando não informadas', async () => {
      prismaMock.registro_pedagogico.create.mockResolvedValue({});

      await relatorioService.criarRegistro({ titulo: 'Teste', data_encerramento: null });

      const { data } = prismaMock.registro_pedagogico.create.mock.calls[0][0];
      expect(data.data_inicial).toBeUndefined();
      expect(data.data_encerramento).toBeNull();
    });
  });

  describe('atualizarRegistro', () => {
    it('atualiza usando o id convertido para número', async () => {
      prismaMock.registro_pedagogico.update.mockResolvedValue({ id_registro_pk: 1 });

      await relatorioService.atualizarRegistro('1', { titulo: 'Novo' });

      expect(prismaMock.registro_pedagogico.update.mock.calls[0][0].where).toEqual({
        id_registro_pk: 1,
      });
    });

    // Regra: ao finalizar, grava a data de conclusão
    it('define data_conclusao ao finalizar um registro ainda não concluído', async () => {
      prismaMock.registro_pedagogico.findUnique.mockResolvedValue({ data_conclusao: null });
      prismaMock.registro_pedagogico.update.mockResolvedValue({});

      await relatorioService.atualizarRegistro(1, { status_registro: 'finalizado' });

      const { data } = prismaMock.registro_pedagogico.update.mock.calls[0][0];
      expect(data.data_conclusao).toBeInstanceOf(Date);
    });

    it('não sobrescreve data_conclusao se já existir', async () => {
      prismaMock.registro_pedagogico.findUnique.mockResolvedValue({
        data_conclusao: new Date('2026-01-01'),
      });
      prismaMock.registro_pedagogico.update.mockResolvedValue({});

      await relatorioService.atualizarRegistro(1, { status_registro: 'finalizado' });

      const { data } = prismaMock.registro_pedagogico.update.mock.calls[0][0];
      expect(data).not.toHaveProperty('data_conclusao');
    });

    it('retorna null ao finalizar um registro inexistente', async () => {
      prismaMock.registro_pedagogico.findUnique.mockResolvedValue(null);

      const resultado = await relatorioService.atualizarRegistro(99, {
        status_registro: 'finalizado',
      });

      expect(resultado).toBeNull();
      expect(prismaMock.registro_pedagogico.update).not.toHaveBeenCalled();
    });

    // P2025 = "registro não encontrado" no Prisma
    it('retorna null quando o Prisma lança P2025', async () => {
      prismaMock.registro_pedagogico.update.mockRejectedValue({ code: 'P2025' });

      expect(await relatorioService.atualizarRegistro(99, { titulo: 'x' })).toBeNull();
    });

    it('repassa outros erros', async () => {
      prismaMock.registro_pedagogico.update.mockRejectedValue(new Error('erro de conexão'));

      await expect(relatorioService.atualizarRegistro(1, { titulo: 'x' })).rejects.toThrow(
        'erro de conexão'
      );
    });
  });

  describe('deletarRegistro', () => {
    it('retorna true ao deletar', async () => {
      prismaMock.registro_pedagogico.delete.mockResolvedValue({});

      expect(await relatorioService.deletarRegistro('1')).toBe(true);
      expect(prismaMock.registro_pedagogico.delete).toHaveBeenCalledWith({
        where: { id_registro_pk: 1 },
      });
    });

    it('retorna false quando o registro não existe (P2025)', async () => {
      prismaMock.registro_pedagogico.delete.mockRejectedValue({ code: 'P2025' });

      expect(await relatorioService.deletarRegistro(99)).toBe(false);
    });

    it('repassa outros erros', async () => {
      prismaMock.registro_pedagogico.delete.mockRejectedValue(new Error('erro de conexão'));

      await expect(relatorioService.deletarRegistro(1)).rejects.toThrow('erro de conexão');
    });
  });

  describe('buscarRegistroPorId', () => {
    it('busca o registro pelo id numérico', async () => {
      prismaMock.registro_pedagogico.findUnique.mockResolvedValue({ id_registro_pk: 7 });

      const resultado = await relatorioService.buscarRegistroPorId('7');

      expect(resultado).toEqual({ id_registro_pk: 7 });
      expect(prismaMock.registro_pedagogico.findUnique).toHaveBeenCalledWith({
        where: { id_registro_pk: 7 },
      });
    });
  });
});