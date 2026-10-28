import { Router } from 'express';
import { getRegistroPedagogico } from '../controllers/dashboardController.js';
import { getRegistroPedagogicoSchema } from '../schemas/dashboardSchema.js';
import { validate } from '../middleware/validate.js'; // Middleware padrão de validação


const router = Router();


// Rota Única: GET /dashboard/registro_pedagogico
router.get(
  '/registro_pedagogico',
  validate(getRegistroPedagogicoSchema),
  getRegistroPedagogico
);


export default router;
