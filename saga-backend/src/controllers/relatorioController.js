class RelatorioController{
    function CriarRegistro(req, res) {
        dados = req.body
        return res.status(201).JSON({
            mensagem: "Registro pedagógico criado com sucesso",
            id: "relatorio_id_123",
            dados: dados
        })
    }
    function EditarRegistro(req, res){
id = req.params.id
dadosAtualizados = req.body
return res.status(200).JSON({
    mensagem: "Registro pedagógico atualizado com sucesso",
    id: id,
    dados: dados atualizados
})
    }
    }
