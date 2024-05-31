import { NextApiRequest, NextApiResponse } from 'next';
import { withFileUpload, getConfig, FormNextApiRequest } from 'next-multiparty';
import { join } from 'path';
import { promises as fsPromises } from 'fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
  const filePath = req.file?.filepath || '';
  const publicFolderPath = join(process.cwd(), 'uploads');
  const destinationPath = join(publicFolderPath, 'user', req.file?.originalFilename || 'error');
  await fsPromises.copyFile(filePath, destinationPath);
  const fileName = req.file?.originalFilename || 'error';

  const { username, password, fullName, role } = req.fields as Record<string, string>;

  if (!username || !password || !fullName || !role) {
    return res.status(422).json({ code: 422, message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(422).json({ code: 422, message: 'Password length should be more than 6 characters' });
  }

  if (!hasUpperCase(password) || !hasLowerCase(password) || !hasNumeric(password) || !hasSymbol(password)) {
    return res.status(422).json({
      code: 422,
      message: 'Password should contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric digit, and 1 symbol',
    });
  }

  const superuserExists: User | null = await prisma.user.findFirst({
    where: {
      role: 'superuser',
    },
  });
  
  if (superuserExists) {
    return res.status(422).json({
      code: 422,
      message: 'A superuser already exists. Only one superuser is allowed.',
    });
  }

  if (role !== 'superuser' && role !== 'admin') {
    return res.status(422).json({
      code: 422,
      message: 'Invalid role. Role must be either "superuser" or "admin"',
    });
  }

  try {
    const exist : User | null = await prisma.user.findUnique({
      where: { username: username },
    });

    if (exist) {
      return res.status(422).json({ code: 422, message: 'User already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user  = await prisma.user.create({
      data: {
        username: username as string,
        password: hashedPassword as string,
        fullName: fullName as string,
        role: role as string,
        avatar: process.env.NEXT_PUBLIC_BACKEND_URL + '/uploads/user/' + fileName as string,
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


