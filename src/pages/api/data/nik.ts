import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? '5d24a52636368d64fa877143e58e4b68770b44a1697a1d0d783eff936f5116a4');
    const userId = (decodedToken as { id: number }).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.method === 'POST') {
    await createNIK(req, res);
  } else if (req.method === 'GET' && req.query.id) {
    await getNIKByNik(req, res);
  } else if (req.method === 'GET') {
    await getNIKList(req, res);
  } else if (req.method === 'PUT') {
    await updateNIK(req, res);
  } else if (req.method === 'DELETE') {
    await deleteNIK(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function createNIK(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring('Bearer '.length);
  const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? '5d24a52636368d64fa877143e58e4b68770b44a1697a1d0d783eff936f5116a4');
  const user_id = (decodedToken as { id: number }).id;

  try {
    const {
      nik,
      nomor_kk,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      rt,
      rw,
      agama,
      status_perkawinan,
      pendidikan_terakhir,
      hubungan,
    } = req.body;

    if (!nik || !nomor_kk || !nama || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !alamat || !rt || !rw || !agama || !status_perkawinan || !pendidikan_terakhir || !hubungan) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const existingNIK = await prisma.nIK.findUnique({
      where: {
        nik,
        deletedAt: null,
      },
    });

    if (existingNIK) {
      return res.status(409).json({ message: 'NIK already exists' });
    }
    const deletedNIK = await prisma.nIK.findUnique({
      where: {
        nik
      },
    });

    if (deletedNIK) {
      return res.status(409).json({ message: 'NIK already exists in deleted table' });
    }

    const existingKK = await prisma.kK.findUnique({
      where: {
        nomor_kk,
        deletedAt: null,
      },
    });

    if (!existingKK) {
      return res.status(422).json({ code: 422, message: 'KK tidak ditemukan' });
    }

    if (!/^\d{16}$/.test(nik)) {
      return res.status(400).json({ message: 'NIK harus 16 digit' });
    }

    if (!/^\d{16}$/.test(nomor_kk)) {
      return res.status(400).json({ message: 'KK harus 16 digit' });
    }

    if (tempat_lahir.length > 50) {
      return res.status(400).json({ message: 'Tempat Lahir maksimal 50 karakter' });
    }

    if (jenis_kelamin.length > 10) {
      return res.status(400).json({ message: 'Jenis Kelamin maksimal 10 karakter' });
    }

    if (agama.length > 12) {
      return res.status(400).json({ message: 'Agama maksimal 12 karakter' });
    }

    if (rt.length > 4 || rw.length > 4) {
      return res.status(400).json({ message: 'RT and RW maksimal 4 karakter' });
    }

    if (status_perkawinan.length > 20) {
      return res.status(400).json({ message: 'Status Perkawinan maksimal 20 karakter' });
    }

    if (pendidikan_terakhir.length > 10) {
      return res.status(400).json({ message: 'Pendidikan Terakhir maksimal 10 karakter' });
    }
    if (hubungan.length > 20) {
      return res.status(400).json({ message: 'Pendidikan Terakhir maksimal 20 karakter' });
    }

    const newNIK = await prisma.nIK.create({
      data: {
        nik,
        user_id,
        nomor_kk,
        nama,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        rt,
        rw,
        agama,
        status_perkawinan,
        pendidikan_terakhir,
        hubungan
      },
    });

    res.status(201).json({ message: 'NIK created successfully', data: newNIK });
  } catch (error) {
    console.error('Error creating NIK:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getNIKList(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const searchQuery = req.query.search as string || '';

    const allowedFilters = [
      'page',
      'pageSize',
      'search',
      'jenis_kelamin',
      'agama',
      'status_perkawinan',
      'pendidikan_terakhir',
    ];

    const invalidKeys = Object.keys(req.query).filter((key) => !allowedFilters.includes(key));
    if (invalidKeys.length > 0) {
      return res.status(400).json({ error: `Invalid filter keys: ${invalidKeys.join(', ')}` });
    }

    const filters = Object.entries(req.query)
      .filter(([key, value]) => key !== 'page' && key !== 'pageSize' && key !== 'search' && value !== undefined)
      .filter(([key]) => allowedFilters.includes(key))
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          ...(value !== '' && { [key]: value }),
        };
      }, {});

    if (Object.values(filters).some((value) => typeof value !== 'string')) {
      return res.status(400).json({ error: 'Filter values must be strings.' });
    }

    const totalCount = await prisma.nIK.count({
      where: {
        deletedAt: null,
        nik: {
          contains: searchQuery,
        },
        ...filters,
      },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const offset = (page - 1) * pageSize;

    const nikList = await prisma.nIK.findMany({
      where: {
        deletedAt: null,
        nik: {
          contains: searchQuery,
        },
        ...filters,
      },
      skip: offset,
      take: pageSize,
      select: {
        id: true,
        user_id: true,
        nik: true,
        nomor_kk: true,
        nama: true,
        tempat_lahir: true,
        tanggal_lahir: true,
        jenis_kelamin: true,
        alamat: true,
        rt: true,
        rw: true,
        agama: true,
        status_perkawinan: true,
        pendidikan_terakhir: true,
        hubungan: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      code: 200,
      data: nikList,
      total: totalCount,
      per_page: pageSize,
      pages: totalPages,
    });
  } catch (error) {
    console.error('Error retrieving NIK list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



async function getNIKByNik(req: NextApiRequest, res: NextApiResponse) {
  try {
    const nik = req.query.id as string;
    const nikData = await prisma.nIK.findUnique({
      where: {
        nik: nik,
        deletedAt: null,
      },
      select: {
        id: true,
        user_id: true,
        nik: true,
        nomor_kk: true,
        nama: true,
        tempat_lahir: true,
        tanggal_lahir: true,
        jenis_kelamin: true,
        alamat: true,
        rt: true,
        rw: true,
        agama: true,
        status_perkawinan: true,
        pendidikan_terakhir: true,
        hubungan: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!nikData) {
      return res.status(404).json({ message: 'NIK not found' });
    }

    res.json({ data: nikData });
  } catch (error) {
    console.error('Error retrieving NIK data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function updateNIK(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring('Bearer '.length);
  const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? '5d24a52636368d64fa877143e58e4b68770b44a1697a1d0d783eff936f5116a4');
  const user_id = (decodedToken as { id: number }).id;

  try {
    const {
      nik_lama,
      nik_baru,
      nomor_kk,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      rt,
      rw,
      agama,
      status_perkawinan,
      pendidikan_terakhir,
      hubungan,
    } = req.body;

    if (!nik_lama || !nik_baru) {
      return res.status(400).json({ message: 'nik_lama dan nik_baru wajib diisi' });
    }

    if (!/^\d{16}$/.test(nik_lama)) {
      return res.status(400).json({ message: 'NIK lama harus 16 digit' });
    }
    if (!/^\d{16}$/.test(nik_baru)) {
      return res.status(400).json({ message: 'NIK baru harus 16 digit' });
    }

    if (!/^\d{16}$/.test(nomor_kk)) {
      return res.status(400).json({ message: 'KK harus 16 digit' });
    }

    if (tempat_lahir.length > 50) {
      return res.status(400).json({ message: 'Tempat Lahir maksimal 50 karakter' });
    }

    if (jenis_kelamin.length > 10) {
      return res.status(400).json({ message: 'Jenis Kelamin maksimal 10 karakter' });
    }

    if (agama.length > 12) {
      return res.status(400).json({ message: 'Agama maksimal 12 karakter' });
    }

    if (rt.length > 4 || rw.length > 4) {
      return res.status(400).json({ message: 'RT and RW maksimal 4 karakter' });
    }

    if (status_perkawinan.length > 12) {
      return res.status(400).json({ message: 'Status Perkawinan maksimal 12 karakter' });
    }

    if (pendidikan_terakhir.length > 10) {
      return res.status(400).json({ message: 'Pendidikan Terakhir maksimal 10 karakter' });
    }
    if (hubungan.length > 20) {
      return res.status(400).json({ message: 'Pendidikan Terakhir maksimal 20 karakter' });
    }

    const existingNIK = await prisma.nIK.findUnique({
      where: {
        nik: nik_lama,
        deletedAt: null,
      },
    });

    if (!existingNIK) {
      return res.status(404).json({ message: 'NIK tidak ditemukan' });
    }

    const existingKK = await prisma.kK.findUnique({
      where: {
        nomor_kk,
        deletedAt: null,
      },
    });

    if (!existingKK) {
      return res.status(404).json({ message: 'KK tidak ditemukan' });
    }

    const updatedNIK = await prisma.nIK.update({
      where: {
        nik: nik_lama,
        deletedAt: null,
      },
      data: {
        user_id,
        nik: nik_baru,
        nomor_kk,
        nama,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        rt,
        rw,
        agama,
        status_perkawinan,
        pendidikan_terakhir,
      },
    });

    res.json({ message: 'NIK updated successfully', data: updatedNIK });
  } catch (error) {
    console.error('Error updating NIK:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function deleteNIK(req: NextApiRequest, res: NextApiResponse) {
  try {
    const nik = req.query.id as string;

    if (!nik) {
      return res.status(400).json({ message: 'NIK is required' });
    }

    const existingNIK = await prisma.nIK.findUnique({
      where: {
        nik,
        deletedAt: null,
      },
    });

    if (!existingNIK) {
      return res.status(404).json({ message: 'NIK not found' });
    }

    await prisma.nIK.update({
      where: {
        nik,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.json({ message: 'NIK deleted successfully' });
  } catch (error) {
    console.error('Error deleting NIK:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
