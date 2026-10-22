Router relatorioRoutes = CRIAR_ROTEADOR()
relatorioRoutes.POST(
    "/registro_pedagogico", 
    ValidarSchema(CriarRelatorioSchema, "body"), 
    RelatorioController.CriarRegistro
)
relatorioRoutes.PATCH(
    "/registro_pedagogico/:id", 
    ValidarSchema(EditarRelatorioParamSchema, "params"),
    ValidarSchema(EditarRelatorioBodySchema, "body"), 
    RelatorioController.EditarRegistro
)