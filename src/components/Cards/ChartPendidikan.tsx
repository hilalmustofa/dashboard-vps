import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';
import { Teacher } from 'iconsax-react';
import { useSession } from 'next-auth/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import {useRouter} from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);


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
      text: 'Chart Pendidikan Terakhir',
    },
  },
};

const labels = ['Tidak Sekolah', 'SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2'];

function ChartPendidikan() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chartData, setChartData] = useState({
    labels,
    datasets: [
      {
        label: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0], 
        backgroundColor: '#8B6CF0',
        hoverBackgroundColor: '#6B6CF0',
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
            const access_token = session?.user?.access_token;
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/education`, {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            });

        if (response.ok) {
          const result = await response.json();
          setChartData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: Object.values(result.data),
              },
            ],
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (session) {
        fetchData();
      }
  }, [session]);

  return (
    <div className='border text-gray-500 w-full p-3 rounded-2xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center text-sm gap-2'>
          <Teacher size={18} />
          <p className='text-gray-800 font-medium'>Chart Pendidikan Terakhir</p>
        </div>
        <Link href={'/warga'}>
          <button className='border px-2 py-1 rounded-lg text-xs'>
            See all
          </button>
        </Link>
      </div>

      <hr className='bg-gray-400 my-4' />
      <Bar options={options} data={chartData} />
    </div>
  );
}

export default ChartPendidikan;
