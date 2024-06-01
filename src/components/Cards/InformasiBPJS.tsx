import React, { useState, useEffect } from 'react';
import { Hospital } from 'iconsax-react';
import Loading from './ui/Barloader';
import { useSession } from 'next-auth/react';

function InformasiBPJS() {
  const { data: session, status } = useSession();
  const [informationList, setInformationList] = useState([
    { key: 'Tidak Memiliki Jaminan Kesehatan', value: 0 },
    { key: 'PBI', value: 0 },
    { key: 'Non PBI', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getJaminanKesehatanCount = async (jaminan_kesehatan: number) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?jaminan_kesehatan=${jaminan_kesehatan}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
              },
            }
          );
          const data = await response.json();
          return data?.data?.length || 0;
        };

        const dataPromises = informationList.map(async (_, index) => ({
          jaminan_kesehatan: index + 1,
          count: await getJaminanKesehatanCount(index + 1),
        }));

        const newData = await Promise.all(dataPromises);

        setInformationList(
          newData.map((item, index) => ({
            key: informationList[index].key,
            value: item.count,
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if(session){
        fetchData();
      }
  }, [informationList, session]);

  if (loading) {
    return <Loading loading={loading} color="#7B6CF0" />;
  }

  return (
    <div className='border text-gray-500 w-full p-3 rounded-2xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center text-sm gap-2'>
          <Hospital size={18} />
          <p className='text-gray-800 font-medium'>Informasi Jaminan Kesehatan</p>
        </div>
      </div>
      <hr className='bg-gray-400 my-2' />
      <div className='space-y-3'>
        {informationList.map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <p className='text-[13px] text-gray-400'>{item.key}</p>
            <div className='flex text-[12px] text-gray-800 font-medium items-center gap-1'>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InformasiBPJS;
