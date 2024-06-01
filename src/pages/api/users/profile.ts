import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from '../auth';
import prisma from '../prisma';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getUserProfile(req, res);
  } else {
    return res.status(405).end();
  }
}

async function getUserProfile(req: NextApiRequest, res: NextApiResponse) {
  const userId = await authenticateToken(req, res);
    if (!userId) {
        return;
    }

  try {
    const user: User | null = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        avatar: true,
      },
    });

    if (user) {
      return res.status(200).json({
        code: 200,
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: 'User tidak ditemukan',
      });
    }
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid token',
    });
  }
}
