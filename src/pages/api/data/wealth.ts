import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from '../auth';
import prisma from '../prisma';

async function calculateWealthDistribution(req: NextApiRequest, res: NextApiResponse) {
    const userId = await authenticateToken(req, res);
    if (!userId) {
        return;
    }
    try {
        const kkList = await prisma.kK.findMany({
            where: {
                deletedAt: null,
            }
        });

        const wealthDistribution = {
            Miskin: 0,
            Menengah: 0,
            Kaya: 0,
        };

        kkList.forEach((kk) => {
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

            if (total >= 28 && total < 50) {
                wealthDistribution.Miskin += 1;
            } else if (total >= 50 && total < 70) {
                wealthDistribution.Menengah += 1;
            } else {
                wealthDistribution.Kaya += 1;
            }
        });

        res.json({ code: 200, data: wealthDistribution });
    } catch (error) {
        console.error('Error calculating wealth distribution:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default calculateWealthDistribution;
