// Aqui fazemos a comunicação com o servidor nodemon
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Importação das Rotas


const app = express();
const PORT = 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Verificação do funcionamento da API


// Utilização das Rotas


// Servidor Iniciado
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
