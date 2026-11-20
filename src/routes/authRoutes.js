// routes/authRoutes.js
import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

const router = express.Router();

// Rotas Públicas (Valida req.body com Zod)
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Rota Privada (Valida Token JWT com authMiddleware)
router.post("/logout", authMiddleware, logout);

export default router;