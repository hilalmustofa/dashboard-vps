// pages/api/profile.tsx

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
}

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getUserProfile(req, res);
  } else {
    return res.status(405).end();
  }
}

async function getUserProfile(req: NextApiRequest, res: NextApiResponse) {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({
      code: 401,
      message: 'Authorization header is missing',
    });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid token format',
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET || '');

    const user: User | null = await prisma.user.findUnique({
      where: { id: (decodedToken as any).id },
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
        message: 'User not found',
      });
    }
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid token',
    });
  }
}
