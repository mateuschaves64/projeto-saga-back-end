// --------------------------------------------------
  // 3. TELA DE RELATÓRIO E HISTÓRICO
  // --------------------------------------------------

  // POST /relatorio/registro_pedagogico
  // async criarRegistro(dados) {
  //   const novoRegistro = {
  //     id_registro_pk: registrosPedagogicos.length + 1,
  //     data_conclusao: dados.status_registro === "finalizado" ? new Date().toISOString() : null,
  //     ...dados
  //   };

  //   registrosPedagogicos.push(novoRegistro);
  //   return novoRegistro;
  // },

  // PATCH /relatorio/registro_pedagogico/:id
  // PATCH /historico/registro_pedagogico/:id
  // async atualizarRegistro(id, dados) {
  //   const index = registrosPedagogicos.findIndex(r => r.id_registro_pk === Number(id));
  //   if (index === -1) return null;

  //   registrosPedagogicos[index] = {
  //     ...registrosPedagogicos[index],
  //     ...dados
  //   };

  //   return registrosPedagogicos[index];
  // },

  // DELETE /historico/registro_pedagogico/:id
  // async deletarRegistro(id) {
  //   const index = registrosPedagogicos.findIndex(r => r.id_registro_pk === Number(id));
  //   if (index === -1) return false;

  //   registrosPedagogicos.splice(index, 1);
  //   return true;
  // },

  // async buscarRegistroPorId(id) {
  //   return registrosPedagogicos.find(r => r.id_registro_pk === Number(id)) || null;
  // },