// src/middlewares/validate.js
export const validate = (schema) => (req, res, next) => {
  try {
    // Se o schema contiver validações para params, body ou query
    if (schema.shape && (schema.shape.params || schema.shape.body || schema.shape.query)) {
      const parsed = schema.parse({
        params: req.params,
        body: req.body,
        query: req.query
      });

      if (parsed.params) req.params = parsed.params;
      if (parsed.body) req.body = parsed.body;
    } else {
      // Validação padrão apenas do corpo (req.body)
      req.body = schema.parse(req.body);
    }

    return next();
  } catch (error) {
    return res.status(400).json({
      message: "Dados inválidos na requisição",
      erros: error.errors.map(err => ({
        campo: err.path.join('.'),
        mensagem: err.message
      }))
    });
  }
};