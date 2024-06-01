import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from '../auth';
import prisma from '../prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await authenticateToken(req, res);
    if (!userId) {
        return;
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
  const user_id = await authenticateToken(req, res);
    if (!user_id) {
        return;
    }

  try {
    const {
      nik,
      nomor_kk,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      pekerjaan,
      alamat,
      rt,
      rw,
      agama,
      status_perkawinan,
      pendidikan_terakhir,
      hubungan,
    } = req.body;

    if (!nik || !nomor_kk || !nama || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !pekerjaan || !alamat || !rt || !rw || !agama || !status_perkawinan || !pendidikan_terakhir || !hubungan) {
      return res.status(422).json({ code: 422, message: 'Semua kolom harus diisi' });
}

    const existingNIK = await prisma.nIK.findUnique({
      where: {
        nik,
        deletedAt: null,
      },
    });

    if (existingNIK) {
      return res.status(409).json({ code: 409, message: 'NIK tersebut sudah ada' });
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
      return res.status(422).json({ code: 422, message: 'NIK harus 16 digit' });
    }

    if (!/^\d{16}$/.test(nomor_kk)) {
      return res.status(422).json({ code: 422, message: 'KK harus 16 digit' });
    }

    if (tempat_lahir.length > 50) {
      return res.status(422).json({ code: 422, message: 'Tempat Lahir maksimal 50 karakter' });
    }

    if (jenis_kelamin.length > 10) {
      return res.status(422).json({ code: 422, message: 'Jenis Kelamin maksimal 10 karakter' });
    }

    if (agama.length > 12) {
      return res.status(422).json({ code: 422, message: 'Agama maksimal 12 karakter' });
    }

    if (rt.length > 4 || rw.length > 4) {
      return res.status(422).json({ code: 422, message: 'RT and RW maksimal 4 karakter' });
    }

    if (status_perkawinan.length > 20) {
      return res.status(422).json({ code: 422, message: 'Status Perkawinan maksimal 20 karakter' });
    }

    if (pendidikan_terakhir.length > 10) {
      return res.status(422).json({ code: 422, message: 'Pendidikan Terakhir maksimal 10 karakter' });
    }
    if (hubungan.length > 20) {
      return res.status(422).json({ code: 422, message: 'Pendidikan Terakhir maksimal 20 karakter' });
    }

    const newNIK = await prisma.nIK.create({
      data: {
        nik,
        user_id : user_id,
        nomor_kk,
        nama,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        pekerjaan,
        alamat,
        rt,
        rw,
        agama,
        status_perkawinan,
        pendidikan_terakhir,
        hubungan
      },
    });

    res.status(201).json({ code: 201, data: newNIK, message: 'Data warga berhasil dibuat' });
  } catch (error) {
    console.error('Error creating NIK:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getNIKList(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const searchQuery = req.query.search as string || '';

    const allowedFilters = [
      'page',
      'per_page',
      'search',
      'jenis_kelamin',
      'agama',
      'rt',
      'rw',
      'hubungan',
      'pekerjaan',
      'tempat_lahir',
      'tanggal_lahir',
      'status_perkawinan',
      'pendidikan_terakhir',
    ];

    const invalidKeys = Object.keys(req.query).filter((key) => !allowedFilters.includes(key));
    if (invalidKeys.length > 0) {
      return res.status(422).json({ error: `Filter tidak valid: ${invalidKeys.join(', ')}` });
    }

    const filters = Object.entries(req.query)
      .filter(([key, value]) => key !== 'page' && key !== 'per_page' && key !== 'search' && value !== undefined)
      .filter(([key]) => allowedFilters.includes(key))
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          ...(value !== '' && { [key]: value }),
        };
      }, {});

    if (Object.values(filters).some((value) => typeof value !== 'string')) {
      return res.status(422).json({ error: 'Filter harus berupa huruf' });
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

    const totalPages = Math.ceil(totalCount / per_page);

    const offset = (page - 1) * per_page;

    const nikList = await prisma.nIK.findMany({
      where: {
        deletedAt: null,
        nik: {
          contains: searchQuery,
        },
        ...filters,
      },
      skip: offset,
      take: per_page,
      select: {
        id: true,
        user_id: true,
        nik: true,
        nomor_kk: true,
        nama: true,
        tempat_lahir: true,
        tanggal_lahir: true,
        jenis_kelamin: true,
        pekerjaan: true,
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
      per_page: per_page,
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
        pekerjaan: true,
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
      return res.status(404).json({ code: 404, message: 'NIK tidak ditemukan' });
    }

    res.json({ code: 200, data: nikData, message: 'Sukses menampilkan data NIK' });
  } catch (error) {
    console.error('Error retrieving NIK data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function updateNIK(req: NextApiRequest, res: NextApiResponse) {
  const user_id = await authenticateToken(req, res);
  if (!user_id) {
      return;
  }
  try {
    const {
      nik_lama,
      nik_baru,
      nomor_kk,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      pekerjaan,
      alamat,
      rt,
      rw,
      agama,
      status_perkawinan,
      pendidikan_terakhir,
      hubungan,
    } = req.body;

    if (!nik_lama || !nik_baru) {
      return res.status(422).json({ code: 422, message: 'nik_lama dan nik_baru wajib diisi' });
    }

    if (!/^\d{16}$/.test(nik_lama)) {
      return res.status(422).json({ code: 422, message: 'NIK lama harus 16 digit' });
    }
    if (!/^\d{16}$/.test(nik_baru)) {
      return res.status(422).json({ code: 422, message: 'NIK baru harus 16 digit' });
    }

    if (!/^\d{16}$/.test(nomor_kk)) {
      return res.status(422).json({ code: 422, message: 'KK harus 16 digit' });
    }

    if (tempat_lahir.length > 50) {
      return res.status(422).json({ code: 422, message: 'Tempat Lahir maksimal 50 karakter' });
    }

    if (jenis_kelamin.length > 10) {
      return res.status(422).json({ code: 422, message: 'Jenis Kelamin maksimal 10 karakter' });
    }

    if(pekerjaan.length > 50) {
      return res.status(422).json({ code: 422, message: 'Pekerjaan maksimal 50 karakter' });
    }
    if(pekerjaan.length < 2) {
      return res.status(422).json({ code: 422, message: 'Pekerjaan minimal 2 karakter' });
    }

    if (agama.length > 12) {
      return res.status(422).json({ code: 422, message: 'Agama maksimal 12 karakter' });
    }

    if (rt.length > 4 || rw.length > 4) {
      return res.status(422).json({ code: 422, message: 'RT and RW maksimal 4 karakter' });
    }

    if (status_perkawinan.length > 12) {
      return res.status(422).json({ code: 422, message: 'Status Perkawinan maksimal 12 karakter' });
    }

    if (pendidikan_terakhir.length > 10) {
      return res.status(422).json({ code: 422, message: 'Pendidikan Terakhir maksimal 10 karakter' });
    }
    if (hubungan.length > 20) {
      return res.status(422).json({ code: 422, message: 'Pendidikan Terakhir maksimal 20 karakter' });
    }

    const existingNIK = await prisma.nIK.findUnique({
      where: {
        nik: nik_lama,
        deletedAt: null,
      },
    });

    if (!existingNIK) {
      return res.status(404).json({ code: 404, message: 'NIK tidak ditemukan' });
    }

    const existingKK = await prisma.kK.findUnique({
      where: {
        nomor_kk,
        deletedAt: null,
      },
    });

    if (!existingKK) {
      return res.status(404).json({ code: 404, message: 'KK tidak ditemukan' });
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
        pekerjaan,
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
      return res.status(422).json({ code: 422, message: 'NIK is required' });
    }

    const existingNIK = await prisma.nIK.findUnique({
      where: {
        nik,
        deletedAt: null,
      },
    });

    if (!existingNIK) {
      return res.status(404).json({ code: 404, message: 'NIK tidak ditemukan' });
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
