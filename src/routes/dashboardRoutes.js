// routes/dashboardRoutes.js
import express from 'express';
import { getRegistroPedagogico } from '../controllers/dashboardController.js';
import { getRegistroPedagogicoSchema } from '../schemas/dashboardSchemas.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// GET /dashboard/registro_pedagogico
router.get(
  '/registro_pedagogico',
  validate(getRegistroPedagogicoSchema),
  getRegistroPedagogico
);

export default router;