Router dashboardRoutes = criar_router()
dashboardRoutes.GET(
    "/registro_pedagogico",
    validarSchema(ConsultaDashboardSchema, "query"),
    DashboardController.ListarComFiltros
)