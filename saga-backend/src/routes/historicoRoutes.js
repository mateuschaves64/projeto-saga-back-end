import express from 'express';
import { updateHistorico, deleteHistorico } from '../controllers/historicoController.js';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { updateHistoricoSchema, idParamSchema } from '../schemas/historicoSchema.js';

const router = express.Router();

// PATCH /historico/registro_pedagogico/:id (Privada | Valida ID e Body | Trava 24h)
router.patch(
  '/registro_pedagogico/:id',
  authMiddleware,
  validate(updateHistoricoSchema),
  updateHistorico
);

// DELETE /historico/registro_pedagogico/:id (Privada | Valida ID)
router.delete(
  '/registro_pedagogico/:id',
  authMiddleware,
  validate(idParamSchema),
  deleteHistorico
);

export default router;