import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { UsdCoin } from 'iconsax-react';
import Link from 'next/link';
import Loading from './ui/Barloader';
import { useSession } from 'next-auth/react';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
};

function ChartEmploymentStatus() {
  const { data: session, status } = useSession();
  const [chartData, setChartData] = useState({
    labels: ['Tidak Bekerja', 'Buruh', 'Pegawai/BUMN/ASN'],
    datasets: [
      {
        label: 'Total ',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderWidth: 2,
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getEmploymentCount = async (pekerjaan_utama: number) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?pekerjaan_utama=${pekerjaan_utama}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
              },
            }
          );
          const data = await response.json();
          return data?.data?.length || 0;
        };

        const dataPromises = chartData.labels.map(async (_, index) => ({
          pekerjaan_utama: index + 1,
          count: await getEmploymentCount(index + 1),
        }));

        const newData = await Promise.all(dataPromises);

        setChartData({
          labels: chartData.labels,
          datasets: [
            {
              label: 'Total ',
              data: newData.map((item) => item.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(54, 162, 235, 0.7)',
              ],
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if(session) {
    fetchData();
    }
  }, [chartData.labels, session]);

  if (loading) {
    return <Loading loading={loading} color="#7B6CF0" />;
  }

  return (
    <div className='border text-gray-500 w-full p-3 rounded-2xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center text-sm gap-2'>
          <UsdCoin size={18} />
          <p className='text-gray-800 font-medium'>Chart Pekerjaan Warga</p>
        </div>
        <Link href={'/warga'}>
          <button className='border px-2 py-1 rounded-lg text-xs'>See all</button>
        </Link>
      </div>
      <hr className='bg-gray-400 my-4' />
      <Pie options={options} data={chartData} className='text-black-800' />
    </div>
  );
}

export default ChartEmploymentStatus;
