import { NextApiRequest, NextApiResponse } from 'next';
import { withFileUpload, getConfig, FormNextApiRequest } from 'next-multiparty';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import prisma from '../prisma';
import { authenticateToken } from '../auth';


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user_id = await authenticateToken(req, res);
  if (!user_id) {
    return;
  }

  if (req.method === 'POST') {
    const contentType = req.headers['content-type'];
    if (contentType && contentType.includes('multipart/form-data')) {
      return withFileUpload(createKKHandler)(req as FormNextApiRequest, res);
    }
  } else if (req.method === 'PUT' && req.query.id) {
    const contentType = req.headers['content-type'];
    if (contentType && contentType.includes('multipart/form-data')) {
      return withFileUpload(updateKKHandler)(req as FormNextApiRequest, res);
    }
  } else if (req.method === 'GET' && req.query.id) {
    await getSingleKK(req, res);
  } else if (req.method === 'GET') {
    await getKKHandler(req, res);
  } else if (req.method === 'DELETE') {
    await deleteKKHandler(req, res);
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function createKKHandler(req: FormNextApiRequest, res: NextApiResponse) {
  const user_id = await authenticateToken(req, res);
  if (!user_id) {
    return;
  }
  const expectedFileKeys = ['foto_1', 'foto_2', 'foto_3'];
  const uploadedFiles = req.files || [];
  const uploadedFileKeys = uploadedFiles.map(file => file.name);

  for (const expectedFileKey of expectedFileKeys) {
    if (!uploadedFileKeys.includes(expectedFileKey)) {
      return res.status(400).json({
        code: 400,
        message: `Invalid file key: ${expectedFileKey}`,
      });
    }
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  for (const file of uploadedFiles) {
    if (file.mimetype && !allowedMimeTypes.includes(file.mimetype)) {
      return res.status(422).json({
        code: 422,
        message: 'Hanya boleh JPG atau PNG',
      });
    }
  }

  const publicFolderPath = join(process.cwd(), 'uploads', 'kk');
  const uploadedFileNames = [];

  try {
    for (const file of uploadedFiles) {
      const getJakartaISODateString = () => {
        const isoString = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace(' ', 'T');
        return isoString.replace(/[-:]/g, '_');
      };

      const uniqueFileName = `${getJakartaISODateString()}_${file.originalFilename}`;
      const destinationPath = join(publicFolderPath, uniqueFileName);

      await fsPromises.copyFile(file.filepath, destinationPath);
      uploadedFileNames.push(uniqueFileName);
      await fsPromises.unlink(file.filepath);
    }
    const {
      nomor_kk,
      nama_kk,
      alamat,
      nama_cp,
      kontak_cp,
      rumah,
      luas,
      lantai,
      dinding,
      atap,
      kondisi,
      air,
      penerangan,
      energi,
      mck,
      jamban,
      limbah,
      anggaran_makan,
      anggaran_pakaian,
      anggaran_daging,
      terdaftar_kis,
      jaminan_kesehatan,
      disabilitas,
      penyakit,
      ijazah_tertinggi,
      tanggungan,
      pekerjaan_utama,
      jumlah_berpenghasilan,
      jumlah_pendapatan,
      aset_elektronik,
      aset_kendaraan,
      jenis_kendaraan,
      jumlah_kendaraan,
      aset_lain,
      hewan_ternak,
    } = req.fields as Record<string, string | number>;

    const existingKK = await prisma.kK.findUnique({
      where: {
        nomor_kk: nomor_kk as string,
      },
    });

    if (existingKK) {
      return res.status(409).json({
        code: 409,
        message: 'KK tersebut sudah ada',
      });
    }

    if (!/^\d{16}$/.test(nomor_kk as string)) {
      return res.status(400).json({ message: 'KK harus 16 digit' });
    }

    const numericFields = [
      { name: 'rumah', value: rumah },
      { name: 'luas', value: luas },
      { name: 'lantai', value: lantai },
      { name: 'dinding', value: dinding },
      { name: 'atap', value: atap },
      { name: 'kondisi', value: kondisi },
      { name: 'air', value: air },
      { name: 'penerangan', value: penerangan },
      { name: 'energi', value: energi },
      { name: 'mck', value: mck },
      { name: 'jamban', value: jamban },
      { name: 'limbah', value: limbah },
      { name: 'anggaran_makan', value: anggaran_makan },
      { name: 'anggaran_pakaian', value: anggaran_pakaian },
      { name: 'anggaran_daging', value: anggaran_daging },
      { name: 'terdaftar_kis', value: terdaftar_kis },
      { name: 'jaminan_kesehatan', value: jaminan_kesehatan },
      { name: 'disabilitas', value: disabilitas },
      { name: 'penyakit', value: penyakit },
      { name: 'ijazah_tertinggi', value: ijazah_tertinggi },
      { name: 'tanggungan', value: tanggungan },
      { name: 'pekerjaan_utama', value: pekerjaan_utama },
      { name: 'jumlah_berpenghasilan', value: jumlah_berpenghasilan },
      { name: 'jumlah_pendapatan', value: jumlah_pendapatan },
      { name: 'aset_elektronik', value: aset_elektronik },
      { name: 'aset_kendaraan', value: aset_kendaraan },
      { name: 'jenis_kendaraan', value: jenis_kendaraan },
      { name: 'jumlah_kendaraan', value: jumlah_kendaraan },
      { name: 'aset_lain', value: aset_lain },
      { name: 'hewan_ternak', value: hewan_ternak },
    ];

    for (const { name, value } of numericFields) {
      const numericValue = Number(value);

      if (isNaN(numericValue) || numericValue < 1 || numericValue > 5) {
        return res.status(422).json({ code: 422, message: `Data ${name} harus berupa angka, minimal 1 maksimal 5` });
      }
    }

    const newKK = await prisma.kK.create({
      data: {
        user_id: Number(user_id),
        nomor_kk: nomor_kk as string,
        nama_kk: nama_kk as string,
        alamat: alamat as string,
        nama_cp: nama_cp as string,
        kontak_cp: kontak_cp as string,
        rumah: Number(rumah),
        luas: Number(luas),
        lantai: Number(lantai),
        dinding: Number(dinding),
        atap: Number(atap),
        kondisi: Number(kondisi),
        air: Number(air),
        penerangan: Number(penerangan),
        energi: Number(energi),
        mck: Number(mck),
        jamban: Number(jamban),
        limbah: Number(limbah),
        anggaran_makan: Number(anggaran_makan),
        anggaran_pakaian: Number(anggaran_pakaian),
        anggaran_daging: Number(anggaran_daging),
        terdaftar_kis: Number(terdaftar_kis),
        jaminan_kesehatan: Number(jaminan_kesehatan),
        disabilitas: Number(disabilitas),
        penyakit: Number(penyakit),
        ijazah_tertinggi: Number(ijazah_tertinggi),
        tanggungan: Number(tanggungan),
        pekerjaan_utama: Number(pekerjaan_utama),
        jumlah_berpenghasilan: Number(jumlah_berpenghasilan),
        jumlah_pendapatan: Number(jumlah_pendapatan),
        aset_elektronik: Number(aset_elektronik),
        aset_kendaraan: Number(aset_kendaraan),
        jenis_kendaraan: Number(jenis_kendaraan),
        jumlah_kendaraan: Number(jumlah_kendaraan),
        aset_lain: Number(aset_lain),
        hewan_ternak: Number(hewan_ternak),
        foto_1: process.env.NEXT_PUBLIC_BACKEND_URL + '/uploads/kk/' + uploadedFileNames[0],
        foto_2: process.env.NEXT_PUBLIC_BACKEND_URL + '/uploads/kk/' + uploadedFileNames[1],
        foto_3: process.env.NEXT_PUBLIC_BACKEND_URL + '/uploads/kk/' + uploadedFileNames[2],
      },
    });

    res.json({
      code: 201,
      message: 'Data KK berhasil ditambahkan',
      data: newKK,
    });

    req.file?.destroy();
  } catch (error) {
    console.error('Error moving file:', error);
    res.status(500).json({ error: error });
  }
}

async function getKKHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const searchQuery = req.query.search as string || '';

    const allowedFilters = [
      'id',
      'page',
      'per_page',
      'search',
      'rumah',
      'luas',
      'lantai',
      'dinding',
      'atap',
      'kondisi',
      'air',
      'penerangan',
      'energi',
      'mck',
      'jamban',
      'limbah',
      'anggaran_makan',
      'anggaran_pakaian',
      'anggaran_daging',
      'terdaftar_kis',
      'jaminan_kesehatan',
      'disabilitas',
      'penyakit',
      'ijazah_tertinggi',
      'tanggungan',
      'pekerjaan_utama',
      'jumlah_berpenghasilan',
      'jumlah_pendapatan',
      'aset_elektronik',
      'aset_kendaraan',
      'jenis_kendaraan',
      'jumlah_kendaraan',
      'aset_lain',
      'hewan_ternak',
    ];

    const invalidKeys = Object.keys(req.query).filter((key) => !allowedFilters.includes(key));
    if (invalidKeys.length > 0) {
      return res.status(400).json({ error: `Invalid filter keys: ${invalidKeys.join(', ')}` });
    }

    const filters = Object.entries(req.query)
      .filter(([key]) => key !== 'page' && key !== 'per_page' && key !== 'search')
      .filter(([key]) => allowedFilters.includes(key))
      .reduce((acc, [key, value]) => {
        const parsedValue = parseInt(value as string, 10);
        return {
          ...acc,
          [key]: isNaN(parsedValue) ? undefined : parsedValue,
        };
      }, {});

    if (Object.values(filters).some((value) => value === undefined)) {
      return res.status(400).json({ error: 'Value can only be number.' });
    }

    const totalCount = await prisma.kK.count({
      where: {
        deletedAt: null,
        nomor_kk: {
          contains: searchQuery
        },
        ...filters,
      }
    });

    const totalPages = Math.ceil(totalCount / per_page);
    const offset = (page - 1) * per_page;
    const kkList = await prisma.kK.findMany({
      where: {
        deletedAt: null,
        nomor_kk: {
          contains: searchQuery,
        },
        ...filters,
      },
      skip: offset,
      take: per_page,
      select: {
        id: true,
        user_id: true,
        nomor_kk: true,
        nama_kk: true,
        alamat: true,
        nama_cp: true,
        kontak_cp: true,
        rumah: true,
        luas: true,
        lantai: true,
        dinding: true,
        atap: true,
        kondisi: true,
        air: true,
        penerangan: true,
        energi: true,
        mck: true,
        jamban: true,
        limbah: true,
        anggaran_makan: true,
        anggaran_pakaian: true,
        anggaran_daging: true,
        terdaftar_kis: true,
        jaminan_kesehatan: true,
        disabilitas: true,
        penyakit: true,
        ijazah_tertinggi: true,
        tanggungan: true,
        pekerjaan_utama: true,
        jumlah_berpenghasilan: true,
        jumlah_pendapatan: true,
        aset_elektronik: true,
        aset_kendaraan: true,
        jenis_kendaraan: true,
        jumlah_kendaraan: true,
        aset_lain: true,
        hewan_ternak: true,
        foto_1: true,
        foto_2: true,
        foto_3: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const kkListWithAnggota = await Promise.all(
      kkList.map(async (kk) => {
        const nikCount = await prisma.nIK.count({
          where: { nomor_kk: kk.nomor_kk, deletedAt: null },
        });

        const totalValues = (kk: { rumah: number; luas: number; lantai: number; dinding: number; atap: number; kondisi: number; air: number; penerangan: number; energi: number; mck: number; jamban: number; limbah: number; anggaran_makan: number; anggaran_pakaian: number; anggaran_daging: number; terdaftar_kis: number; jaminan_kesehatan: number; disabilitas: number; penyakit: number; ijazah_tertinggi: number; tanggungan: number; pekerjaan_utama: number; jumlah_berpenghasilan: number; jumlah_pendapatan: number; aset_elektronik: number; aset_kendaraan: number; jenis_kendaraan: number; jumlah_kendaraan: number; aset_lain: number; hewan_ternak: number; }) =>
          kk.rumah +
          kk.luas +
          kk.lantai +
          kk.dinding +
          kk.atap +
          kk.kondisi +
          kk.air +
          kk.penerangan +
          kk.energi +
          kk.mck +
          kk.jamban +
          kk.limbah +
          kk.anggaran_makan +
          kk.anggaran_pakaian +
          kk.anggaran_daging +
          kk.terdaftar_kis +
          kk.jaminan_kesehatan +
          kk.disabilitas +
          kk.penyakit +
          kk.ijazah_tertinggi +
          kk.tanggungan +
          kk.pekerjaan_utama +
          kk.jumlah_berpenghasilan +
          kk.jumlah_pendapatan +
          kk.aset_elektronik +
          kk.aset_kendaraan +
          kk.jenis_kendaraan +
          kk.jumlah_kendaraan +
          kk.aset_lain +
          kk.hewan_ternak;

        const total = totalValues(kk);

        const customResponse = {
          id: kk.id,
          user_id: kk.user_id,
          nomor_kk: kk.nomor_kk,
          nama_kk: kk.nama_kk,
          alamat: kk.alamat,
          nama_cp: kk.nama_cp,
          kontak_cp: kk.kontak_cp,
          anggota: nikCount,
          status:
            total >= 28 && total < 50
              ? 'Miskin'
              : total >= 50 && total < 70
                ? 'Menengah'
                : 'Kaya',
          rumah: kk.rumah,
          luas: kk.luas,
          lantai: kk.lantai,
          dinding: kk.dinding,
          atap: kk.atap,
          kondisi: kk.kondisi,
          air: kk.air,
          penerangan: kk.penerangan,
          energi: kk.energi,
          mck: kk.mck,
          jamban: kk.jamban,
          limbah: kk.limbah,
          anggaran_makan: kk.anggaran_makan,
          anggaran_pakaian: kk.anggaran_pakaian,
          anggaran_daging: kk.anggaran_daging,
          terdaftar_kis: kk.terdaftar_kis,
          jaminan_kesehatan: kk.jaminan_kesehatan,
          disabilitas: kk.disabilitas,
          penyakit: kk.penyakit,
          ijazah_tertinggi: kk.ijazah_tertinggi,
          tanggungan: kk.tanggungan,
          pekerjaan_utama: kk.pekerjaan_utama,
          jumlah_berpenghasilan: kk.jumlah_berpenghasilan,
          jumlah_pendapatan: kk.jumlah_pendapatan,
          aset_elektronik: kk.aset_elektronik,
          aset_kendaraan: kk.aset_kendaraan,
          jenis_kendaraan: kk.jenis_kendaraan,
          jumlah_kendaraan: kk.jumlah_kendaraan,
          aset_lain: kk.aset_lain,
          hewan_ternak: kk.hewan_ternak,
          foto_1: kk.foto_1,
          foto_2: kk.foto_2,
          foto_3: kk.foto_3,
          createdAt: kk.createdAt,
          updatedAt: kk.updatedAt,
        };

        return customResponse;
      })
    );

    res.json({
      code: 200,
      data: kkListWithAnggota,
      total: totalCount,
      per_page: per_page,
      pages: totalPages,
    });
  } catch (error) {
    console.error('Error retrieving KK list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function getSingleKK(req: NextApiRequest, res: NextApiResponse) {
  try {
    const nomor_kk = req.query.id as string;
    const kkData = await prisma.kK.findUnique({
      where: {
        nomor_kk,
        deletedAt: null,
      },
      select: {
        id: true,
        user_id: true,
        nomor_kk: true,
        nama_kk: true,
        alamat: true,
        nama_cp: true,
        kontak_cp: true,
        rumah: true,
        luas: true,
        lantai: true,
        dinding: true,
        atap: true,
        kondisi: true,
        air: true,
        penerangan: true,
        energi: true,
        mck: true,
        jamban: true,
        limbah: true,
        anggaran_makan: true,
        anggaran_pakaian: true,
        anggaran_daging: true,
        terdaftar_kis: true,
        jaminan_kesehatan: true,
        disabilitas: true,
        penyakit: true,
        ijazah_tertinggi: true,
        tanggungan: true,
        pekerjaan_utama: true,
        jumlah_berpenghasilan: true,
        jumlah_pendapatan: true,
        aset_elektronik: true,
        aset_kendaraan: true,
        jenis_kendaraan: true,
        jumlah_kendaraan: true,
        aset_lain: true,
        hewan_ternak: true,
        foto_1: true,
        foto_2: true,
        foto_3: true,
        nik: {
          select: {
            id: true,
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
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!kkData) {
      return res.status(404).json({ message: 'KK tidak ditemukan' });
    }

    res.json({ code: 200, data: kkData, message: 'Sukses menampilkan data KK' });
  } catch (error) {
    console.error('Error retrieving KK data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function updateKKHandler(req: FormNextApiRequest, res: NextApiResponse) {
  const user_id = await authenticateToken(req, res);
  if (!user_id) {
    return;
  }

  const expectedFileKeys = ['foto_1', 'foto_2', 'foto_3'];
  const uploadedFiles = req.files || [];
  const uploadedFileKeys = uploadedFiles.map(file => file.name);

  for (const expectedFileKey of expectedFileKeys) {
    if (uploadedFileKeys.includes(expectedFileKey)) {
      const file = uploadedFiles.find(file => file.name === expectedFileKey);
      if (!file) {
        return res.status(500).json({ error: `Uploaded file for key ${expectedFileKey} tidak ditemukan` });
      }
      const fileMimeType = file.mimetype;
      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      if (!fileMimeType || !allowedMimeTypes.includes(fileMimeType)) {
        return res.status(422).json({
          code: 422,
          message: 'Hanya boleh JPG atau PNG',
        });
      }
    }
  }

  const publicFolderPath = join(process.cwd(), 'uploads');
  const uploadedFileNames = [];

  try {
    for (const file of uploadedFiles) {
      const getJakartaISODateString = () => {
        const isoString = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace(' ', 'T');
        return isoString.replace(/[-:]/g, '_');
      };

      const uniqueFileName = `${getJakartaISODateString()}_${file.originalFilename}`;
      const destinationPath = join(publicFolderPath, 'kk', uniqueFileName);

      await fsPromises.copyFile(file.filepath, destinationPath);
      uploadedFileNames.push(uniqueFileName);
      await fsPromises.unlink(file.filepath);
    }

    const nomor_kk = req.query.id as string;

    const updateData: Record<string, any> = {
      user_id: Number(user_id)
    };

    const optionalFields = ['nomor_kk', 'nama_kk', 'alamat', 'nama_cp', 'kontak_cp'];
    for (const field of optionalFields) {
      if (req.fields[field] !== undefined) {
        updateData[field] = req.fields[field];
      }
    }

    const numericFields = [
      'rumah',
      'luas',
      'lantai',
      'dinding',
      'atap',
      'kondisi',
      'air',
      'penerangan',
      'energi',
      'mck',
      'jamban',
      'limbah',
      'anggaran_makan',
      'anggaran_pakaian',
      'anggaran_daging',
      'terdaftar_kis',
      'jaminan_kesehatan',
      'disabilitas',
      'penyakit',
      'ijazah_tertinggi',
      'tanggungan',
      'pekerjaan_utama',
      'jumlah_berpenghasilan',
      'jumlah_pendapatan',
      'aset_elektronik',
      'aset_kendaraan',
      'jenis_kendaraan',
      'jumlah_kendaraan',
      'aset_lain',
      'hewan_ternak',
    ];

    for (const field of numericFields) {
      if (req.fields[field] !== undefined) {
        updateData[field] = Number(req.fields[field]);
      }
    }


    for (const file of uploadedFiles) {
      const getJakartaISODateString = () => {
        const isoString = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace(' ', 'T');
        return isoString.replace(/[-:]/g, '_');
      };
      const fotoIndex = file.name.split('_')[1];
      const uniqueFileName = `${getJakartaISODateString()}_${file.originalFilename}`;
      updateData[`foto_${fotoIndex}`] = process.env.NEXT_PUBLIC_BACKEND_URL + '/uploads/kk/' + uniqueFileName;
    }


    const existingKK = await prisma.kK.findUnique({
      where: {
        nomor_kk,
        deletedAt: null,
      }
    });

    if (!existingKK) {
      return res.status(404).json({ message: 'KK tidak ditemukan' });
    }

    if (!/^\d{16}$/.test(nomor_kk as string)) {
      return res.status(400).json({ message: 'NIK harus 16 digit' });
    }

    const updatedKK = await prisma.kK.update({
      where: {
        nomor_kk,
        deletedAt: null,
      },
      data: updateData,
    });

    res.json({ message: 'KK updated successfully', data: updatedKK });
  } catch (error) {
    console.error('Error updating KK:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function deleteKKHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const nomor_kk = req.query.id as string;

    const existingKK = await prisma.kK.findUnique({
      where: {
        nomor_kk,
        deletedAt: null,
      },
      include: {
        nik: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingKK) {
      return res.status(404).json({ code: 422, message: 'KK tidak ditemukan' });
    }

    if (existingKK.nik.length > 0) {
      return res.status(400).json({ code: 422, message: 'KK mempunyai data NIK, tidak bisa dihapus' });
    }

    await prisma.kK.update({
      where: {
        nomor_kk,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.json({ message: 'KK deleted successfully' });
  } catch (error) {
    console.error('Error deleting KK:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;
export const config = getConfig();
