import {relatorioService} from '../services/relatorioService.js';

export const updateHistorico = async (req, res) => {
    try{
        const {id} = req.params;
        const dadosAtualziados = req.body;

        const registroExistente = await relatorioService.buscarRegistroPorId(id);

        if(!registroExistente){
            return res.status(404).json({message: 'Registro não encontrado.'});
    }
}
}  

const dataCriacao = new Date(registroExistente.data_inicial);
const agora = new Date();
const diferencaEmhORAS = (agora - dataCriacao) / (1000 * 60 * 60);

if (diferencaEmhORAS > 24) {
    return res.status(403).json({message: "Ação não permitida: o passo de 24 horas para alteração expirou"
    });
}

const registroAtualizado = await relatorioService.atualizarRegistro(id, dadosAtualizacao);

return res.status(200).json({
    message: "Registro atualizado com sucesso.", 
    data: registroAtualizado}); 
    
} catch(error){
    console.error('Erro em UpdateHistorico', error);
    return res.status(500).json({message: 'Erro interno de servidor ao atualizar o histórico.'});
};

export const deleteHistorico = async (req, res) => {
    try{
        const {id} = req.params;

        const deletado = await relatorioService.deletarRegistro(id);

        id(!deletado){
            return res.status(404).json({message: 'Registro pedagógico não encontrado para exclusão.'});
        
        };
    }

    return res.status(204).json({message: 'Registro pedagógico excluído com sucesso.'});
}catch(error){
    console.error('Erro em deleteHistorico', error);
    return res.status(500).json({message: 'Erro interno de servidor ao excluir o histórico.'});
}
