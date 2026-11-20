import prisma from "../../db.js";


const paraData = (valor) => (valor ? new Date(valor) : valor);

export const relatorioService = {
  // --------------------------------------------------
  // 3. TELA DE RELATÓRIO E HISTÓRICO
  // --------------------------------------------------


  async criarRegistro(dados) {

    return prisma.registro_pedagogico.create({
      data: {
        ...dados,
        data_inicial: paraData(dados.data_inicial),
        data_encerramento: paraData(dados.data_encerramento),
      },
    });
  },

  async atualizarRegistro(id, dados) {
    const idRegistro = Number(id);

    const data = {
      ...dados,
      data_inicial: paraData(dados.data_inicial),
      data_encerramento: paraData(dados.data_encerramento),
    };


    if (dados.status_registro === "finalizado") {
      const atual = await prisma.registro_pedagogico.findUnique({
        where: { id_registro_pk: idRegistro },
        select: { data_conclusao: true },
      });

      if (!atual) return null;
      if (!atual.data_conclusao) data.data_conclusao = new Date();
    }

    try {
      return await prisma.registro_pedagogico.update({
        where: { id_registro_pk: idRegistro },
        data,
      });
    } catch (error) {

      if (error.code === "P2025") return null;
      throw error;
    }
  },

  async deletarRegistro(id) {
    try {
      await prisma.registro_pedagogico.delete({
        where: { id_registro_pk: Number(id) },
      });
      return true;
    } catch (error) {

      if (error.code === "P2025") return false;
      throw error;
    }
  },

 
  async buscarRegistroPorId(id) {

    return prisma.registro_pedagogico.findUnique({
      where: { id_registro_pk: Number(id) },
    });
  },
};