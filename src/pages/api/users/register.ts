import { NextApiRequest, NextApiResponse } from 'next';
import { withFileUpload, getConfig, FormNextApiRequest } from 'next-multiparty';
import { join } from 'path';
import { promises as fsPromises } from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../prisma';


interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
  password: string;
}

function hasUpperCase(str: string): boolean {
  return /[A-Z]/.test(str);
}

function hasLowerCase(str: string): boolean {
  return /[a-z]/.test(str);
}

function hasNumeric(str: string): boolean {
  return /\d/.test(str);
}

function hasSymbol(str: string): boolean {
  return /[!@#$%^&*(),.?":{}|<>]/.test(str);
}


export default async function handler(req: FormNextApiRequest, res: NextApiResponse) {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    return withFileUpload(createUserHandler)(req as FormNextApiRequest, res);
  } else {
    await createUserHandler(req, res);
  } 
    return res.status(405).json({ message: 'Method Not allowed' });
}

async function createUserHandler(req: FormNextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }

  const token = authHeader.substring('Bearer '.length);
  const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET || '5d24a52636368d64fa877143e58e4b68770b44a1697a1d0d783eff936f5116a4');
  const user = await prisma.user.findUnique({ where: { id: (decodedToken as { id: number }).id } });

  if (!user || user.role !== 'superuser') {
    return res.status(403).json({ code: 403, message: 'Hanya superadmin yang bisa mendaftarkan user' });
  }

  const expectedFileKey = 'avatar';
  const uploadedFileKey = req.file?.name;

  if (uploadedFileKey !== expectedFileKey) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid file key',
    });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  const fileMimeType = req.file?.mimetype;

  if (!fileMimeType || !allowedMimeTypes.includes(fileMimeType)) {
    return res.status(422).json({
      code: 422,
      message: 'Hanya boleh JPG atau PNG',
    });
  }
  
  const getJakartaISODateString = () => {
    const isoString = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace(' ', 'T');
    return isoString.replace(/[-:]/g, '_');
  };

  const uniqueFileName = `${getJakartaISODateString()}_${req.file?.originalFilename || 'error'}`;
  
  const filePath = req.file?.filepath || '';
  const publicFolderPath = join(process.cwd(), 'uploads');
  const destinationPath = join(publicFolderPath, 'user', uniqueFileName);
  await fsPromises.copyFile(filePath, destinationPath);

  const { username, password, fullName, role } = req.fields as Record<string, string>;

  if (!username || !password || !fullName || !role) {
    return res.status(422).json({ code: 422, message: "Semua kolom harus diisi" });
  }

  if (password.length < 6) {
    return res.status(422).json({ code: 422, message: 'Password minimal 6 karakter' });
  }

  if (!hasUpperCase(password) || !hasLowerCase(password) || !hasNumeric(password) || !hasSymbol(password)) {
    return res.status(422).json({
      code: 422,
      message: 'Password harus berupa huruf kapital, huruf kecil, angka, dan simbol',
    });
  }

  const superuserExists: User | null = await prisma.user.findFirst({
    where: {
      role: 'superuser',
    },
  });
  
  if (role !== 'superuser' && role !== 'admin') {
    return res.status(422).json({
      code: 422,
      message: 'Hanya boleh `superuser` atau `admin`',
    });
  }
  
  if (role === 'superuser' && superuserExists) {
    return res.status(422).json({
      code: 422,
      message: 'Role `superuser` sudah ada, gunakan `admin`',
    });
  }

  try {
    const exist : User | null = await prisma.user.findUnique({
      where: { username: username },
    });

    if (exist) {
      return res.status(422).json({ code: 422, message: 'User sudah ada' });
    }
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user  = await prisma.user.create({
      data: {
        username: username as string,
        password: hashedPassword as string,
        fullName: fullName as string,
        role: role as string,
        avatar: process.env.NEXT_PUBLIC_BACKEND_URL + '/uploads/user/' + uniqueFileName as string,
      },
    });

    const sanitizedUser = exclude(user, ['password']);
    return res.status(201).json({ code: 201, user: sanitizedUser });
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

export const config = getConfig();



