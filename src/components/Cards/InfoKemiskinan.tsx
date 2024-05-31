import React, { useEffect, useState } from 'react';
import { InfoCircle, ArrowRight3 } from 'iconsax-react';
import { useSession } from 'next-auth/react';

interface InformationEndpoint {
  key: string;
  endpoint: string;
}

const informationEndpoints: InformationEndpoint[] = [
  { key: 'Rumah yang masih berlantai tanah', endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?lantai=1` },
  { key: 'Rumah yang masih berdinding kayu', endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?dinding=1` },
  { key: 'Rumah yang masih gabung listrik tetangga', endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?penerangan=1` },
  { key: 'Rumah yang masih menggunakan MCK bersama', endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?air=1` },
  { key: 'Rumah yang masih menggunakan jamban cemplung', endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?jamban=1` },
];

interface InformationItem {
  key: string;
  value: number;
  link: string;
}

function InfoKemiskinan() {
  const [informationList, setInformationList] = useState<InformationItem[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const promises = informationEndpoints.map(async (item) => {
        try {
          const response = await fetch(item.endpoint, {
            headers: {
              Authorization: `Bearer ${session?.user.access_token}`,
            },
          });

          const data = await response.json();
          const value = data.data ? data.data.length : 0;

          return { key: item.key, value, link: item.endpoint };
        } catch (error) {
          console.error(`Error fetching data for ${item.key}:`, error);
          return { key: item.key, value: 0, link: item.endpoint };
        }
      });

      const result = await Promise.all(promises);
      setInformationList(result);
    };

    if(session){
      fetchData();
    }
  }, [session]);

  return (
    <div className='border text-gray-500 w-full p-3 rounded-2xl'>
      <div className='flex items-center text-sm gap-2'>
        <InfoCircle size={18} />
        <p className='text-gray-800 font-medium'>Informasi Tingkat Kemiskinan</p>
      </div>
      <hr className='bg-gray-400 my-4' />
      <p className='text-[13px]'>Berikut adalah rata rata informasi terkait rumah tinggal yang dihitung berdasarkan data dari semua KK</p>
      <p className='text-[12px] italic mb-2'>(klik pada nomor untuk melihat data)</p>
      <div className='space-y-3'>
        {informationList.map((item, index) => (
          <div key={index} className='flex items-start gap-1 w-full'>
            <ArrowRight3 size={18} className='mt-[1px]' />
            <div className='w-full space-y-1'>
              <p className='text-[13px] text-gray-400 font-medium'>{item.key}</p>
              <p className='text-[12px] text-gray-800 font-medium'>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfoKemiskinan;
