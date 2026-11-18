import { jest } from '@jest/globals';

// Banco "falso" compartilhado pelos testes.
// Se um service usar um novo método do Prisma, adicione aqui.
export const prismaMock = {
  usuario: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  curso: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  registro_pedagogico: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};