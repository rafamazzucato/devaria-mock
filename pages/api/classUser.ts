import { connectToDB } from './../../middlewares/connectToDB';
import { DefaultMessageResponse } from './../../types/DefaultMessageResponse';
import type {NextApiRequest, NextApiResponse} from 'next';
import { jwtValidator } from '@/middlewares/jwtValidator';
import moment from 'moment';
import { ClassModel } from '@/models/Class';
import { ClassUserModel } from '@/models/ClassUser';
import { UserModel } from '@/models/User';



const handler = async (req : NextApiRequest, res : NextApiResponse<DefaultMessageResponse>) => {
    try {
        if(req.method !== 'POST'){
            return res.status(405).json({error: 'Método solicitado não existe!'});
        }

        const userId = req?.body?.userId ? req?.body?.userId : req?.query?.userId as string;
        if(!userId){
            return res.status(400).json({error: 'Usuário não encontrado'});
        }
        
        const user = await UserModel.findById(userId);

        const classes = await ClassModel.find();

        const random = Math.floor(Math.random() * 100);
        const randomPercentage = Math.floor(Math.random() * 100);
        const randomPlan = Math.floor(Math.random() * 1);
        const randomPayment = Math.floor(Math.random() * 2);
        const randomBill = Math.floor(Math.random() * 4);
        const randomNotification = Math.floor(Math.random() * 45);
        const randomScheduleAdvanced = Math.floor(Math.random() * 2)+1;
        const randomScheduleExclusive = Math.floor(Math.random() * 3)+1;
        const divisorTurma = Math.floor(random / 20);
        const turma = classes[divisorTurma];

        const paymentType = randomPayment === 0 ? 'CREDIT' : randomPayment === 1 ? 'SLIP' : 'PIX';
        const planType = randomPlan === 0 ? 'ADVANCED' : 'EXCLUSIVE';
        const lastBill = paymentType === 'SLIP' ? moment(turma.start).add(randomBill, 'M').toString() : null ;
        const lastNotification = lastBill ? moment(lastBill).add(randomNotification, 'd').toString() : null;
        const lastSchedule = planType === 'ADVANCED' ? 'M'+randomScheduleAdvanced + 'S'+ randomScheduleExclusive : 'S'+randomScheduleExclusive;
        const classUser = {
            user: user,
            class: turma,
            planType,
            paymentType,
            lastBill,
            lastNotification,
            lastSchedule,
            currentPercentage: randomPercentage
        };

        await ClassUserModel.create(classUser);

        return res.status(200).json({msg: 'Aluno cadastrado na turma!'});
    } catch (ex) {
        console.log('Ocorreu erro ao cadastrar aluno na turma:', ex);
        res.status(500).json({error: 'Ocorreu erro ao cadastrar aluno na turma, tente novamente!'});
    }
}

export default connectToDB(jwtValidator(handler));