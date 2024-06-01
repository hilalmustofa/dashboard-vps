import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }

  const token = authHeader.substring('Bearer '.length);
  const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET || '5d24a52636368d64fa877143e58e4b68770b44a1697a1d0d783eff936f5116a4');
  const user = await prisma.user.findUnique({ where: { id: (decodedToken as { id: number }).id } });

  if (!user || user.role !== 'superuser') {
    return res.status(403).json({ code: 403, message: 'Hanya superadmin yang bisa melihat list user' });
  }

  try {
    const per_page = parseInt(req.query.per_page as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const usernameFilter = req.query.username as string | undefined;

    const totalUsers = await prisma.user.count();
    const totalPages = Math.ceil(totalUsers / per_page);
    const offset = (page - 1) * per_page;

    let userList;
    if (usernameFilter) {
      userList = await prisma.user.findMany({
        where: {
          username: {
            contains: usernameFilter
          },
        },
        skip: offset,
        take: per_page,
      });
    } else {
      userList = await prisma.user.findMany({
        skip: offset,
        take: per_page,
      });
    }

    const sanitizedUserList = userList.map((user) => exclude(user, ['password']));
    return res.status(200).json({
      code: 200,
      data: sanitizedUserList,
      total: totalUsers,
      per_page: per_page,
      page: page,
      total_pages : totalPages
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

const exclude = (user: User, keys: string[]): Partial<User> => {
  const sanitizedUser = { ...user };
  for (let key of keys) {
    delete sanitizedUser[key as keyof User];
  }
  return sanitizedUser;
};
