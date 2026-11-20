import express from "express";
import { criarRegistro, atualizarRegistro } from "../controllers/relatorioController.js";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { criarRegistroSchema, atualizarRegistroSchema } from "../schemas/relatorioSchema.js";

const router = express.Router();

// Rota Privada: Criar novo relatório pedagógico (Status: Pendente ou Em andamento)
router.post(
  "/registro_pedagogico",
  authMiddleware,
  validate(criarRegistroSchema),
  criarRegistro
);

// Rota Privada: Atualizar relatório pedagógico por ID
router.patch(
  "/registro_pedagogico/:id",
  authMiddleware,
  validate(atualizarRegistroSchema),
  atualizarRegistro
);

export default router;