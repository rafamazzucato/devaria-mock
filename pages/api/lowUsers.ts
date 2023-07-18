import { connectToDB } from './../../middlewares/connectToDB';
import { DefaultMessageResponse } from './../../types/DefaultMessageResponse';
import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtValidator } from '@/middlewares/jwtValidator';
import { verifyAdminUser } from '@/middlewares/adminRoutes';
import moment from 'moment';
import { ClassUserModel } from '@/models/ClassUser';
import { ClassModel } from '@/models/Class';

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | any>) => {
    try {
        if (req.method !== 'GET' && req.method !== 'PUT') {
            return res.status(405).json({error: 'Método solicitado não existe!'});
        }

        const now = moment();
        if (req.method === 'GET') {
            const students = await ClassUserModel.find({
                "$or": [
                    { lastLowStatusNotification: null }, 
                    {lastLowStatusNotification: { $lt: now.add(-45, 'd')}}
                ] 
            }).populate(['user', 'class']);

            const lowPerformance = students.filter((s:any) => {
                const percentageAccordingMonth = moment(s.class.start).diff(now, 'M')*8.33;
                return s.currentPercentage < percentageAccordingMonth;
            });

            const result = lowPerformance.map((d: any) => {
                const percentageAccordingMonth = moment(d.class.start).diff(now, 'M')*8.33;
                
                return {
                    _id: d._id,
                    name: d.user?.name,
                    email: d.user?.email,
                    currentPercentage: d.currentPercentage,
                    rangePercentage: percentageAccordingMonth
                }
            })

            return res.status(200).json(result);
        } else {
            const { rmId } = req.body;
            const lowPerformance = await ClassUserModel.findById(rmId);

            if (!lowPerformance) {
                return res.status(400).json({ error: 'Usuário da turma não encontrado' });
            }

            lowPerformance.lastLowStatusNotification = now;
            await ClassUserModel.findByIdAndUpdate({ _id: lowPerformance._id }, lowPerformance);
            return res.status(200).json({ msg: 'Notificação de performance atualizada.' });
        }
    } catch (ex) {
        console.log('Ocorreu erro ao cadastrar turma:', ex);
        res.status(500).json({ error: 'Ocorreu erro ao cadastrar turma, tente novamente!' });
    }
}

export default connectToDB(jwtValidator(verifyAdminUser(handler)));