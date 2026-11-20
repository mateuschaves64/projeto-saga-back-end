
import express from "express";
import { listarUsuarios } from "../controllers/usuariosController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /usuarios (Rota privada)
router.get("/", authMiddleware, listarUsuarios);

export default router;
