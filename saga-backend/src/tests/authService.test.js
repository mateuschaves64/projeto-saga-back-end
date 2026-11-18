import { jest } from '@jest/globals';
import { prismaMock } from './helpers/prismaMock.js';

// Substitui o db.js real pelo mock (obrigatório em cada arquivo de teste)
jest.unstable_mockModule('../../db.js', () => ({ default: prismaMock }));

// O service deve ser importado DEPOIS do mock
const { authService } = await import('../services/authService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authService', () => {
  // GET /usuarios
  describe('buscarTodosUsuarios', () => {
    it('retorna a lista selecionando apenas campos públicos', async () => {
      prismaMock.usuario.findMany.mockResolvedValue([{ id_usuario_pk: 1 }]);

      const resultado = await authService.buscarTodosUsuarios();

      expect(resultado).toHaveLength(1);
      // Garante que a senha não é selecionada
      expect(prismaMock.usuario.findMany).toHaveBeenCalledWith({
        select: {
          id_usuario_pk: true,
          nome_completo: true,
          email_usu: true,
          preferencia_contraste: true,
          preferencia_tema: true,
        },
      });
    });
  });

  // POST /auth/register
  describe('registrarUsuario', () => {
    const dados = {
      nome_completo: 'Ana',
      email_usu: 'ana@teste.com',
      senha_usu: '123456',
    };

    it('lança erro 409 se o e-mail já existe', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue({ id_usuario_pk: 1 });

      await expect(authService.registrarUsuario(dados)).rejects.toMatchObject({
        message: 'E-mail já cadastrado',
        status: 409,
      });
      // Não deve tentar criar o usuário
      expect(prismaMock.usuario.create).not.toHaveBeenCalled();
    });

    it('cria o usuário com preferências padrão', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);
      prismaMock.usuario.create.mockResolvedValue({ id_usuario_pk: 2, ...dados });

      await authService.registrarUsuario(dados);

      expect(prismaMock.usuario.create).toHaveBeenCalledWith({
        data: {
          ...dados,
          preferencia_tema: false,
          preferencia_contraste: false,
          token_lembrar_me: null,
        },
      });
    });

    it('não retorna a senha no resultado', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);
      prismaMock.usuario.create.mockResolvedValue({ id_usuario_pk: 2, ...dados });

      const resultado = await authService.registrarUsuario(dados);

      expect(resultado).not.toHaveProperty('senha_usu');
      expect(resultado.email_usu).toBe('ana@teste.com');
    });
  });

  // Busca usuário pelo e-mail (usado no login)
  describe('findUserByEmail', () => {
    it('busca o usuário pelo e-mail', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue({ id_usuario_pk: 1 });

      const resultado = await authService.findUserByEmail('ana@teste.com');

      expect(resultado).toEqual({ id_usuario_pk: 1 });
      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
        where: { email_usu: 'ana@teste.com' },
      });
    });
  });

  // Token do "Lembrar-me"
  describe('salvarTokenLembrarMe', () => {
    it('salva um token no formato esperado', async () => {
      prismaMock.usuario.update.mockResolvedValue({});

      await authService.salvarTokenLembrarMe('5');

      const { where, data } = prismaMock.usuario.update.mock.calls[0][0];
      expect(where).toEqual({ id_usuario_pk: 5 }); // id convertido para número
      expect(data.token_lembrar_me).toMatch(/^tk_lembrar_5_\d+$/);
    });
  });

  // POST /auth/logout
  describe('logout', () => {
    it('retorna true com token', async () => {
      expect(await authService.logout('abc')).toBe(true);
    });

    it('retorna true mesmo sem token', async () => {
      expect(await authService.logout(undefined)).toBe(true);
    });
  });

  // PATCH /usuario/configuracoes
  describe('atualizarPreferencias', () => {
    it('envia apenas os campos informados', async () => {
      prismaMock.usuario.update.mockResolvedValue({ id_usuario_pk: 1, senha_usu: 'x' });

      await authService.atualizarPreferencias(1, { preferencia_tema: true });

      expect(prismaMock.usuario.update).toHaveBeenCalledWith({
        where: { id_usuario_pk: 1 },
        data: { preferencia_tema: true },
      });
    });

    it('aceita valor false (não ignora valores falsy)', async () => {
      prismaMock.usuario.update.mockResolvedValue({ id_usuario_pk: 1 });

      await authService.atualizarPreferencias(1, { preferencia_contraste: false });

      expect(prismaMock.usuario.update.mock.calls[0][0].data).toEqual({
        preferencia_contraste: false,
      });
    });

    it('não retorna a senha', async () => {
      prismaMock.usuario.update.mockResolvedValue({ id_usuario_pk: 1, senha_usu: 'x' });

      const resultado = await authService.atualizarPreferencias(1, { preferencia_tema: true });

      expect(resultado).not.toHaveProperty('senha_usu');
    });
  });
});