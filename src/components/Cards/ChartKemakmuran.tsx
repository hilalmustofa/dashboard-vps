import { WalletMoney } from 'iconsax-react'
import DonutChart from './ui/donut'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Loading from './ui/Barloader';
import { useRouter } from 'next/navigation';

interface ColorGuideProps {
    color: string;
    label: string;
  }

function ChartKemakmuran() {
    const [data, setData] = useState<any>({ data: {} });
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

  const ColorGuide: React.FC<ColorGuideProps> = ({ color, label }) => (
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 rounded-md bg-gray-200" style={{ backgroundColor: color }}></div>
      <p className="text-[12px]">{label}</p>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = session?.user?.access_token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/wealth`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if(response.ok) {
        const result = await response.json();
        setData(result);
        } 
        else {
        router.push('/auth');
        }
      } catch (error) {
      }
      finally {
        setLoading(false)
      }
    };

    if (session) {
        fetchData();
      }
  }, [session]);

  useEffect(() => {
    if (Object.keys(data.data).length > 0) {
      setLoading(false);
    }
  }, [data]);

  
  if (loading) {
    return <Loading loading={loading} color="#7B6CF0" />;
  }

  const hasData = Object.values(data.data).some(value => value as number > 0);

    return (
        <div className='border text-gray-500 w-full p-3 rounded-2xl'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <WalletMoney size={18} />
                    <p className='text-gray-800 font-medium'>Chart Kemakmuran</p>
                </div>
                <Link href={'/kk'}>
                <button className='border px-2 py-1 rounded-lg text-[13px]'>
                    See all
                </button>
                </Link>
            </div>
            <hr className='bg-gray-400 my-4' />
            <div className='flex justify-between'>
      {loading ? (
        <Loading loading={loading} color="#7B6CF0" />
      ) : hasData ? (
        <>
          <DonutChart data={data.data} />
          <div className='space-y-1 text-gray-800 text-xs mt-2'>
            <p className='text-sm text-gray-800 font-semibold'>Data Kemakmuran Warga</p>
            <ColorGuide color="#FF6384" label="Miskin" />
            <ColorGuide color="#FFCE56" label="Menengah" />
            <ColorGuide color="#8ADE7A" label="Kaya" />
            <p className='text-xxs italic text-gray-400'>
              Data ini adalah data realtime yang diambil dari hasil kalkulasi detail setiap KK
            </p>
          </div>
        </>
      ) : (
        <div className='text-xs flex text-center'>No data</div>
      )}
    </div>
  </div>
    )
}

export default ChartKemakmuran