import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Loading from '../Cards/ui/Barloader';
import { useRouter } from 'next/navigation';
import Pagination from '../Pagination';
import ExportExcel from '../ExportWarga';
import Link from 'next/link';
import { PrimaryButton } from '../ui/Button';
import { Add } from 'iconsax-react';

interface WargaData {
  id: number;
  nomor_kk: string;
  nik: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  pekerjaan: string;
  alamat: string;
  rt: string;
  rw: string;
  agama: string;
  status_perkawinan: string;
  pendidikan_terakhir: string;
  hubungan: string;
}

function TableWarga() {
  const [currentPage, setCurrentPage] = useState(0);
  const [exportParams, setExportParams] = useState<{ search: string, key: string, value: string }>({ search: '', key: '', value: '' });
  const [data, setData] = useState<WargaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();

  const keyOptions: Record<string, string[]> = {
    agama: ['Islam', 'Kristen', 'Hindu', 'Buddha', 'Khonghucu'],
    status_perkawinan: ['Kawin', 'Kawin Tercatat', 'Belum Kawin', 'Cerai Mati', 'Cerai Hidup'],
    pendidikan_terakhir: ['Tidak Sekolah', 'SD', 'SMP', 'SMA', 'D3', 'S1', 'S2'],
    jenis_kelamin: ['Laki-Laki', 'Perempuan'],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = session?.user?.access_token;

        let queryString = `?search=${searchQuery}`;
        if (selectedKey && selectedKey !== 'id') {
          queryString += `&${selectedKey}=${selectedValue}`;
        } else if (selectedKey === 'id') {
          queryString = `?id=${searchQuery}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/nik${queryString}&page=${currentPage + 1}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result.data);
          setTotalPages(result.pages);
          setLoading(false);

          setExportParams({
            search: searchQuery,
            key: selectedKey,
            value: selectedValue,
          });

        } else {
          router.push('/auth');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, currentPage, searchQuery, selectedKey, selectedValue, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setTotalPages(totalPages)
  };

  const handleClearFilter = () => {
    setSelectedKey('');
    setSelectedValue('');
    setSearchQuery('');
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKey(e.target.value);
    setSelectedValue('');
  };

  if (loading) {
    return <Loading loading={loading} color="#7B6CF0" />;
  }

  return (
    <>
      <div className='text-sm md:pb-2 flex items-center justify-between'>
        <div>
          <h1 className='text-gray-800 text[14px] font-medium'>Tips</h1>
          <p className='text-[13px]'>Hanya admin tertentu yang dapat merubah atau menghapus data</p>
        </div>
        <div className='flex gap-2'>
        <ExportExcel exportParams={exportParams} />
          <Link href={'/warga/add'}>
            <PrimaryButton>
              <div className="flex items-center">
                <Add size={16} className="hidden sm:inline" />
                <p className="text-xs leading-[0.80rem]">
                  Tambah Warga
                </p>
              </div>
            </PrimaryButton>
          </Link>
        </div>
      </div>
      <hr className='-mx-4' />
      <div className='flex w-full rounded-md text-xs'>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by NIK`}
            className="p-2 text-[13px] border rounded-lg mr-2 mb-2"
          />

          <select
            value={selectedKey || ''}
            onChange={handleKeyChange}
            className="p-2 text-[13px] border rounded-lg mr-2 mb-2"
          >
            <option value="" disabled>
              Pilih filter
            </option>
            {Object.keys(keyOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          {selectedKey && (
            <select
              value={selectedValue || ''}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="p-2 text-[13px] border rounded-lg mr-2 mb-2"
            >
              <option value="" disabled>
                Pilih data
              </option>
              {keyOptions[selectedKey].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          )}
          {selectedKey && (
            <button type="button" className="text-red-700 text-xxs font-medium" onClick={handleClearFilter}>
              Clear Filter
            </button>
          )}
        </form>
      </div>
      <div className="border text-gray-500 w-full p-3 rounded-2xl overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-left text-[13px]">
            <tr className="border-b-2">
              <th className="p-2">No</th>
              <th className="p-2">No KK</th>
              <th className="p-2">NIK</th>
              <th className="p-2">Nama</th>
              <th className="p-2">Tempat Lahir</th>
              <th className="p-2">Tanggal Lahir</th>
              <th className="p-2">Jenis Kelamin</th>
              <th className="p-2">Pekerjaan</th>
              <th className="p-2">Alamat</th>
              <th className="p-2">RT</th>
              <th className="p-2">RW</th>
              <th className="p-2">Agama</th>
              <th className="p-2">Status Perkawinan</th>
              <th className="p-2">Pendidikan Terakhir</th>
              <th className="p-2">Hubungan Keluarga</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, index) => (
              <tr key={index + 1}>
                <td className="p-2">
                  <p className="text-[12px]">{index + 1}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.nomor_kk}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.nik}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.nama}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.tempat_lahir}</p>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.tanggal_lahir}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.jenis_kelamin}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.pekerjaan}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.alamat}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.rt}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.rw}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.agama}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.status_perkawinan}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.pendidikan_terakhir}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.hubungan}</p>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page - 1)}
      />
    </>
  );
}

export default TableWarga;

