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
        if (req.method !== 'GET' && req.method !== 'PUT') {
           }

        const now = moment();
        if (req.method === 'GET') {
            const debtors = await ClassUserModel.find({
                paymentType: 'SLIP',
                lastBill: { $lt: now.toString() },
                "$or": [{ lastNotification: null }, { lastNotification: { $lt: now.add(-7, 'd') } }]
            }).populate('user');

            const result = debtors.map((d: any) => {
                return {
                    _id: d._id,
                    name: d.user?.name,
                    email: d.user?.email,
                    lastPaymentDay: moment(d.lastBill).add(30, 'd').format('DD/MM/yyyy')
                }
            })

            return res.status(200).json(result);
        }else{
            const {rmId} = req.body;
            const debtor = await ClassUserModel.findById(rmId);

            if(!debtor){
                return res.status(400).json({ error: 'Usuário da turma não encontrado' });
            }

            debtor.lastNotification = now;
            await ClassUserModel.findByIdAndUpdate({ _id: debtor._id }, debtor);
            return res.status(200).json({msg: 'Notificação atualizada.'}); 
        }
    } catch (ex) {
        console.log('Ocorreu erro ao cadastrar turma:', ex);
        res.status(500).json({ error: 'Ocorreu erro ao cadastrar turma, tente novamente!' });
    }
}

export default connectToDB(jwtValidator(verifyAdminUser(handler)));