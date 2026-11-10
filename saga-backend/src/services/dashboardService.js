
  // --------------------------------------------------
  // 4. TELA DE DASHBOARD (ROTA ÚNICA GET COM FILTROS)
  // --------------------------------------------------

  // GET /dashboard/registro_pedagogico
  // async buscarDashboard(filtros = {}) {
  //   const { data_inicial, data_final, id_curso_fk, curso, tipo_relatorio } = filtros;

  //   return registrosPedagogicos.filter(reg => {
  //     // Filtro por tipo de relatório ('atendimento_geral' ou 'acompanhamento_pedagogico')
  //     if (tipo_relatorio && reg.tipo_relatorio !== tipo_relatorio) {
  //       return false;
  //     }

  //     // Filtro por ID do Curso
  //     if (id_curso_fk && reg.id_curso_fk !== Number(id_curso_fk)) {
  //       return false;
  //     }

  //     // Filtro por Nome/ENUM do Curso usando a lista de cursos
  //     if (curso) {
  //       const cursoEncontrado = cursos.find(c => 
  //         c.nome_curso.toLowerCase().includes(curso.toLowerCase()) || 
  //         c.tipo_curso === curso
  //       );
  //       if (!cursoEncontrado || reg.id_curso_fk !== cursoEncontrado.id_curso_pk) {
  //         return false;
  //       }
  //     }

  //     // Filtro por intervalo de datas
  //     if (data_inicial && data_final) {
  //       const regData = new Date(reg.data_inicial);
  //       const inicio = new Date(data_inicial);
  //       const fim = new Date(data_final);

  //       if (regData < inicio || regData > fim) {
  //         return false;
  //       }
  //     }

  //     return true;
  //   });
  // },

//   async salvarTokenLembrarMe(idUsuario) {
//   const usuario = usuarios.find(u => u.id_usuario_pk === Number(idUsuario));
//   if (usuario) {
//     usuario.token_lembrar_me = `tk_lembrar_${usuario.id_usuario_pk}_${Date.now()}`;
//   }
//   return usuario;
// }