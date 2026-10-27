// middlewares/validate.js
export const validate = (schema) => (req, res, next) => {
  try {
    // Valida apenas o req.body
    schema.parse(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({
      message: "Dados inválidos",
      erros: error.errors
    });
  }
};