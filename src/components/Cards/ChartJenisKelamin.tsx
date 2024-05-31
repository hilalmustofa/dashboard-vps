import React, { useEffect, useState } from 'react';
import { Man, Woman, Profile2User } from 'iconsax-react';
import Loading from './ui/Barloader';
import { useSession } from 'next-auth/react';

interface GenderData {
  data: any[]; 
}

function ChartJenisKelamin() {
  const [menCount, setMenCount] = useState<number | null>(null);
  const [womenCount, setWomenCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menResponse, womenResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/nik?jenis_kelamin=Laki-Laki`, {
            headers: {
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/nik?jenis_kelamin=Perempuan`, {
            headers: {
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          }),
        ]);

        const menData: GenderData = await menResponse.json();
        const womenData: GenderData = await womenResponse.json();

        setMenCount(menData?.data?.length || 0);
        setWomenCount(womenData?.data?.length || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if(session){
      fetchData();
    }
  }, [session]);

  if (loading) {
    return <Loading loading={loading} color="#7B6CF0" />; 
  }

  const totalPopulation = menCount! + womenCount!;
  const menPercentage = (menCount! / totalPopulation) * 100;
  const womenPercentage = (womenCount! / totalPopulation) * 100;

  return (
    <div className='border text-gray-500 w-full p-3 rounded-2xl'>
      <div className='flex items-center text-sm gap-2'>
        <Profile2User size={18} />
        <p className='text-gray-800 font-medium'>Chart Jenis Kelamin</p>
      </div>
      <hr className='bg-gray-400 my-4' />
      <div className='flex'>
        <div className='flex flex-col min-w-[9rem] items-center mr-8'>
          <div className='flex justify-between w-full'>
            <div className='flex flex-col items-center'>
              <Man size={14} />
              <p className='text-xxs font-semibold mt-2 text-gray-800 transition-transform transform ease-in'>
                {menPercentage.toFixed(2)}%
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <Woman size={14} />
              <p className='text-xxs font-semibold mt-2 text-gray-800 transition-transform transform ease-in'>
                {womenPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className='relative w-full h-6 bg-gray-300 rounded-full mt-2'>
            <div
              className='absolute bottom-0 rounded-s-lg left-0 h-full bg-blue-400 transition-width duration-500 ease-in'
              style={{ width: `${menPercentage}%` }}
            ></div>
            <div
              className='absolute bottom-0 rounded-e-lg right-0 h-full bg-pink-400 transition-width duration-500 ease-in'
              style={{ width: `${womenPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className='flex flex-col'>
          <p className='text-[11px] text-gray-600 mb-2'>
            Dari total {totalPopulation} warga Kapanewon Krembangan, terdapat {menCount} warga laki-laki dan {womenCount} warga perempuan
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChartJenisKelamin;
