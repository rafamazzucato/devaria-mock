import { connectToDB } from './../../middlewares/connectToDB';
import { DefaultMessageResponse } from './../../types/DefaultMessageResponse';
import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtValidator } from '@/middlewares/jwtValidator';
import { verifyAdminUser } from '@/middlewares/adminRoutes';
import moment from 'moment';
import { ClassUserModel } from '@/models/ClassUser';
import { UserModel } from '@/models/User';


const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | any>) => {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Método solicitado não existe!' });
        }

        const now = moment();

        const debtors = await ClassUserModel.find({
            paymentType: 'SLIP',
            lastBill : { $lt: now.toString() },
            "$or": [{ lastNotification: null }, { lastNotification: { $lt: now.add(-5, 'd') } }]
        }).populate('user');

        return res.status(200).json(debtors);
    } catch (ex) {
        console.log('Ocorreu erro ao cadastrar turma:', ex);
        res.status(500).json({ error: 'Ocorreu erro ao cadastrar turma, tente novamente!' });
    }
}

export default connectToDB(jwtValidator(verifyAdminUser(handler)));