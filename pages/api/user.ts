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
        if (req.method !== 'PUT') {
            return res.status(405).json({ error: 'Método solicitado não existe!' });
        }

        const { user } = req.body;
        const userObj = await UserModel.findById(user);

        if (!userObj) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        userObj.isActive = !userObj.isActive;
        await UserModel.findByIdAndUpdate({ _id: userObj._id }, userObj);
        return res.status(200).json({ msg: 'Toggle usuário realizado.' });

    } catch (ex) {
        console.log('Ocorreu erro ao gerenciar usuários:', ex);
        res.status(500).json({ error: 'Ocorreu erro ao gerenciar usuários, tente novamente!' });
    }
}

export default connectToDB(jwtValidator(verifyAdminUser(handler)));