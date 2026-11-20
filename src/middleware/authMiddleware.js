import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: "Token inválido" });
  }

  const token = parts[1].trim().replace(/^"|"$/g, '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta');
    
    // Injeta os dados do usuário decodificados na requisição
    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};