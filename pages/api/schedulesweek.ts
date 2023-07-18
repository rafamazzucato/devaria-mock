import { connectToDB } from './../../middlewares/connectToDB';
import { DefaultMessageResponse } from './../../types/DefaultMessageResponse';
import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtValidator } from '@/middlewares/jwtValidator';
import { verifyAdminUser } from '@/middlewares/adminRoutes';
import moment from 'moment';
import { ClassUserModel } from '@/models/ClassUser';

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | any>) => {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({error: 'Método solicitado não existe!'});
        }

        const now = moment();
        const weekNumberInMonth = now.week() - moment(now).startOf('month').week()
        const monthNumberInQuarter = Math.round(now.month() / 3);
        
        console.log(monthNumberInQuarter)

        const scheduledsInWeek = await ClassUserModel
            .find({lastSchedule: {$regex: 'S'+weekNumberInMonth, $options: 'i'}}).populate('user');

        const scheduledsInWeekActive = scheduledsInWeek.filter((d: any) => 
            d.user.isActive && (d.planType === 'EXCLUSIVE' || d.lastSchedule.includes('M'+monthNumberInQuarter)));

        const result = scheduledsInWeekActive.map((d: any) => {
            return {
                _id: d._id,
                userId: d.user?._id,
                name: d.user?.name,
                email: d.user?.email,
                schedule: d.lastSchedule
            }
        })

        return res.status(200).json(result);
    } catch (ex) {
        console.log('Ocorreu erro ao cadastrar turma:', ex);
        res.status(500).json({ error: 'Ocorreu erro ao cadastrar turma, tente novamente!' });
    }
}

export default connectToDB(jwtValidator(verifyAdminUser(handler)));