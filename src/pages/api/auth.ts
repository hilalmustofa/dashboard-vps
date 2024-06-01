import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export const authenticateToken = async (req: NextApiRequest, res: NextApiResponse): Promise<number | null> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ code: 401, message: 'Unauthorized' });
        return null;
    }

    const token = authHeader.substring('Bearer '.length);
    try {
        const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? '5d24a52636368d64fa877143e58e4b68770b44a1697a1d0d783eff936f5116a4');
        const userId = (decodedToken as { id: number }).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(401).json({ code: 401, message: 'Unauthorized' });
            return null;
        }

        return userId;
    } catch (error) {
        res.status(401).json({ code: 401, message: 'Invalid token' });
        return null;
    }
};
