import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
  password: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await loginUserHandler(req, res);
  } else {
    return res.status(405).end();
  }
}

async function loginUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ code: 401, message: 'Username atau Password salah' });
  }

  try {
    const user: User | null = await prisma.user.findUnique({
      where: { username: username },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const accessToken = createAccessToken({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      });

      return res.status(200).json({
        code: 200,
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        access_token: accessToken,
      });
    } else {
      return res.status(401).json({ code: 401, message: 'Username atau Password salah' });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
}

function createAccessToken(payload: {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
}): string {
  const secret = process.env.NEXTAUTH_SECRET ?? '5d24a52636368d64fa877143e58e4b68770b44a1697a1d0d783eff936f5116a4';
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '24h' });
  return token;
}
