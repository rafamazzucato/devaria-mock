import { connectToDB } from './../../middlewares/connectToDB';
import { DefaultMessageResponse } from './../../types/DefaultMessageResponse';
import type {NextApiRequest, NextApiResponse} from 'next';
import { jwtValidator } from '@/middlewares/jwtValidator';
import { verifyAdminUser } from '@/middlewares/adminRoutes';
import moment from 'moment';
import { ClassModel } from '@/models/Class';

type Class = {
    name: string,
    start: string,
    finish : string
}

const handler = async (req : NextApiRequest, res : NextApiResponse<DefaultMessageResponse>) => {
    try {
        if(req.method !== 'POST'){
            return res.status(405).json({error: 'Método solicitado não existe!'});
        }

        const {name, start, finish} = req.body as Class;

        if(!name || name.trim().length < 2 ){
            return res.status(400).json({error: 'Nome inválido!'});
        }

        const startDt = moment(start);
        if(!startDt){
            return res.status(400).json({error: 'Data de início inválida!'});
        }

        const finishDt = moment(finish);
        if(!finishDt || finishDt.isBefore(startDt)){
            return res.status(400).json({error: 'Data de fim inválida!'});
        }

        const cls = {
            name,
            start,
            finish
        };

        await ClassModel.create(cls);

        return res.status(200).json({msg: 'Turma cadastrada!'});
    } catch (ex) {
        console.log('Ocorreu erro ao cadastrar turma:', ex);
        res.status(500).json({error: 'Ocorreu erro ao cadastrar turma, tente novamente!'});
    }
}

export default connectToDB(jwtValidator(verifyAdminUser(handler)));