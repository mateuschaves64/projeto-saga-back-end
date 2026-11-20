// jest.config.js (na raiz do projeto)
export default {
  // Ambiente Node (backend)
  testEnvironment: 'node',

  // Sem Babel: usa ESM nativo
  transform: {},

  // Limpa o histórico de chamadas dos mocks entre os testes
  clearMocks: true,

  // Cobertura: só os services (ignora db.js, testes, etc.)
  collectCoverageFrom: ['src/services/**/*.js'],

  // Relatório HTML (base para gerar o PDF)
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Relatório de Testes',
      outputPath: 'relatorio/test-report.html',
    }],
  ],
};