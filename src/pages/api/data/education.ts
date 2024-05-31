import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

async function getEducationLevelCount(req: NextApiRequest, res: NextApiResponse) {
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
    try {
        const educationLevelCounts = await prisma.nIK.groupBy({
            by: ['pendidikan_terakhir'],
            _count: {
                id: true,
            },
            where: {
                deletedAt: null,
            },
        });

        let tidakSekolahCount = 0;
        let sdCount = 0;
        let smpCount = 0;
        let smaSmkCount = 0;
        let d3Count = 0;
        let s1Count = 0;
        let s2Count = 0;

        educationLevelCounts.forEach((levelCount) => {
            const educationLevel = levelCount.pendidikan_terakhir;

            switch (educationLevel) {
                case 'Tidak Sekolah':
                    tidakSekolahCount += levelCount._count.id;
                    break;
                case 'SD':
                    sdCount += levelCount._count.id;
                    break;
                case 'SMP':
                    smpCount += levelCount._count.id;
                    break;
                case 'SMA':
                case 'SMK':
                    smaSmkCount += levelCount._count.id;
                    break;
                case 'D3':
                    d3Count += levelCount._count.id;
                    break;
                case 'S1':
                    s1Count += levelCount._count.id;
                    break;
                case 'S2':
                    s2Count += levelCount._count.id;
                    break;
            }
        });

        const response = {
            code: 200,
            data: {
                tidak_sekolah: tidakSekolahCount,
                sd: sdCount,
                smp: smpCount,
                sma_smk: smaSmkCount,
                d3: d3Count,
                s1: s1Count,
                s2: s2Count,
            },
        };
        res.json(response);
    } catch (error) {
        console.error('Error retrieving education level count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getEducationLevelCount;
