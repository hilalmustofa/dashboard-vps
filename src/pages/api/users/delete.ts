import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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
    return res.status(403).json({ code: 403, message: 'Hanya superadmin yang bisa menghapus user' });
  }

  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ code: 400, message: 'user_id wajib diisi' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(user_id as string) } });
    if (!existingUser) {
      return res.status(404).json({ code: 404, message: 'User tidak ditemukan' });
    }

    if(existingUser.role === 'superuser') {
        return res.status(403).json({ code: 403, message: 'Tidak bisa menghapus superadmin' });
    }

    await prisma.user.delete({ where: { id: parseInt(user_id as string) } });
    return res.status(200).json({ code: 200, message: 'User berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
