import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { DefaultMessageResponse } from '../types/DefaultMessageResponse';
import { UserModel } from '@/models/User';

export const verifyAdminUser = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse>) => {

        const userId = req?.body?.userId ? req?.body?.userId : req?.query?.userId as string;

        if (!userId) {
            return res.status(401).json({ error: 'Usuário não encontrado!' });
        }

        const userFound = await UserModel.findById(userId);
        if (!userFound || userFound.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Você não tem permissão para acessar essa rota' });
        }

        return handler(req, res);
    }