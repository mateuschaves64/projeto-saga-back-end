// Aqui fazemos a comunicação com o servidor nodemon
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Importação das Rotas
import authRoutes from './src/routes/authRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import historicoRoutes from './src/routes/historicoRoutes.js';
import relatorioRoutes from './src/routes/relatorioRoutes.js';

const app = express();
const PORT = 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Verificação do funcionamento da API
app.get('/', (req, res) => {
  return res.status(200).json({ message: "API rodando com sucesso." });
});

// Utilização das Rotas
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/historico', historicoRoutes);
app.use('/relatorio', relatorioRoutes);

// Servidor Iniciado
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});