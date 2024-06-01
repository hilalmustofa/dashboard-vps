import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Heart } from 'iconsax-react';
import Link from 'next/link';
import Loading from './ui/Barloader';
import { useSession } from 'next-auth/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart Marriage Status',
    },
  },
};

function ChartMarriageStatus() {
  const [chartData, setChartData] = useState({
    labels: ['Belum Kawin', 'Kawin', 'Kawin Tercatat', 'Cerai Hidup', 'Cerai Mati'],
    datasets: [
      {
        fill: true,
        label: 'Jumlah',
        data: [0, 0, 0, 0, 0],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getStatusCount = async (status: string) => {
            const access_token = session?.user?.access_token;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/nik?status_perkawinan=${encodeURIComponent(status)}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
              },
            }
          );
          const data = await response.json();
          return data?.data?.length || 0;
        };

        const dataPromises = chartData.labels.map(async (status) => ({
          status,
          count: await getStatusCount(status),
        }));

        const newData = await Promise.all(dataPromises);

        setChartData({
          labels: chartData.labels,
          datasets: [
            {
              fill: true,
              label: 'Jumlah',
              data: newData.map((item) => item.count),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if(session){
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
          <Heart size={18} />
          <p className='text-gray-800 font-medium'>Chart Status Pernikahan</p>
        </div>
        <Link href={'/warga'}>
          <button className='border px-2 py-1 rounded-lg text-xs'>See all</button>
        </Link>
      </div>
      <hr className='bg-gray-400 my-4' />
      <Line options={options} data={chartData} />
    </div>
  );
}

export default ChartMarriageStatus;
