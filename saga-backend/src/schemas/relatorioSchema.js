import { z } from "zod";

const CriarRelatorioSchema = ZOD.object({
    titulo: ZOD.text().notnull(),
    conteudo: ZOD.text().notnull(),
    status: ZOD.enum(["Pendente", "Em_andamento"])
})

const EditarRelatorioParamSchema = ZOD.object({
    id: ZOD.text().notnull()
})

const EditarRelatorioBodySchema = ZOD.object({
    titulo: ZOD.text().optional(),
    conteudo: ZOD.text().optional(),
    status: ZOD.enum(["Pendente", "Em_andamento", "Concluido"]).optional()
})