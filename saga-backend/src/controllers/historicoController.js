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