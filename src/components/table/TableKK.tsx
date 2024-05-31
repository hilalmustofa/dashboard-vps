import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../../components/Cards/ui/Barloader';
import Pagination from '../Pagination';
import Link from 'next/link';
import { values } from '../Questions';

interface KKData {
  id: number;
  nomor_kk: string;
  nama_kk: string;
  anggota: number;
  status: string;
  alamat: string;
  rumah: number;
  luas: number;
  lantai: number;
  dinding: number;
  atap: number;
  kondisi: number;
  air: number;
  penerangan: number;
  energi: number;
  mck: number;
  jamban: number;
  limbah: number;
  anggaran_makan: number;
  anggaran_pakaian: number;
  anggaran_daging: number;
  terdaftar_kis: number;
  jaminan_kesehatan: number;
  disabilitas: number;
  penyakit: number;
  ijazah_tertinggi: number;
  tanggungan: number;
  pekerjaan_utama: number;
  jumlah_berpenghasilan: number;
  jumlah_pendapatan: number;
  aset_elektronik: number;
  aset_kendaraan: number;
  jenis_kendaraan: number;
  jumlah_kendaraan: number;
  aset_lain: number;
  hewan_ternak: number;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

interface ManipulatedData {
  id: number;
  id_kk: string;
  nama_kk: string;
  anggota: number;
  status: string;
  alamat: string;
  score: number;
}

interface Filter {
  key: string;
  value: string;
}

function TableKK() {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<ManipulatedData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = session?.user?.access_token;
        const filterParams: Filter[] = [];

        if (selectedKey && selectedValue) {
          filterParams.push({ key: selectedKey, value: selectedValue });
        }

        const filterQueryString = filterParams
          .map((filter) => `${filter.key}=${filter.value}`)
          .join('&');

        let queryString = `?search=${searchQuery}`;
        if (selectedKey && selectedKey !== "id") {
          queryString += `&${selectedKey}=${selectedValue}`;
        } else if (selectedKey === "id") {
          queryString = `?id=${searchQuery}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk${queryString}&page=${currentPage + 1}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const result = await response.json();

        const manipulatedData: ManipulatedData[] = result.data.map((item: KKData, index: number) => {
          const {
            rumah,
            luas,
            lantai,
            dinding,
            atap,
            kondisi,
            air,
            penerangan,
            energi,
            mck,
            jamban,
            limbah,
            anggaran_makan,
            anggaran_pakaian,
            anggaran_daging,
            terdaftar_kis,
            jaminan_kesehatan,
            disabilitas,
            penyakit,
            ijazah_tertinggi,
            tanggungan,
            pekerjaan_utama,
            jumlah_berpenghasilan,
            jumlah_pendapatan,
            aset_elektronik,
            aset_kendaraan,
            jenis_kendaraan,
            jumlah_kendaraan,
            aset_lain,
            hewan_ternak,
          } = item;


          const score =
            rumah +
            luas +
            lantai +
            dinding +
            atap +
            kondisi +
            air +
            penerangan +
            energi +
            mck +
            jamban +
            limbah +
            anggaran_makan +
            anggaran_pakaian +
            anggaran_daging +
            terdaftar_kis +
            jaminan_kesehatan +
            disabilitas +
            penyakit +
            ijazah_tertinggi +
            tanggungan +
            pekerjaan_utama +
            jumlah_berpenghasilan +
            jumlah_pendapatan +
            aset_elektronik +
            aset_kendaraan +
            jenis_kendaraan +
            jumlah_kendaraan +
            aset_lain +
            hewan_ternak;

          return {
            id: index + 1,
            id_kk: item.nomor_kk,
            nama_kk: item.nama_kk,
            anggota: item.anggota,
            status: item.status,
            alamat: item.alamat,
            score,
          };
        });
        if (response.ok) {
          setData(manipulatedData);
          setTotalPages(result.pages);
          setLoading(false);
          const queryString = filterParams.map((filter) => `${filter.key}=${filter.value}`).join('&');
        router.push(`/kk?${queryString}`);
        } else {
          router.push('/auth');
        }
      } catch (error) {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, currentPage, searchQuery, selectedKey, selectedValue, router]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Miskin':
        return 'bg-[#ff6384b3]';
      case 'Menengah':
        return 'bg-[#FFCE56]';
      case 'Kaya':
        return 'bg-[#8ADE7A]';
      default:
        return 'bg-gray-500';
    }
  };


  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKey(e.target.value);
    setSelectedValue("");
  };

  const handleClearFilter = () => {
    setSelectedKey('');
    setSelectedValue('');
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setTotalPages(totalPages)
  };

  if (loading) {
    return <Loading loading={loading} color="#7B6CF0" />;
  }

  return (
    <>
      <div className='flex w-full rounded-md text-xs'>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by KK..."
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
            {values.map((category) => (
              <optgroup label={category.name} key={category.name}>
                {category.options.map((option) => (
                  <option key={option.key} value={option.key} title={option.question.length > 30 ? option.question : undefined}>
                    {option.question.length > 60 ? `${option.question.substring(0, 60)}...` : option.question}
                  </option>
                ))}
              </optgroup>
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
              {values
                .flatMap((category) => category.options)
                .find((option) => option.key === selectedKey)?.options.map((valueOption) => (
                  <option key={valueOption.value} value={valueOption.value}>
                    {valueOption.label}
                  </option>
                ))}
            </select>
          )}
        </form>
        {selectedKey && (
          <button type="button" className="text-red-700 text-xxs font-medium" onClick={handleClearFilter}>
            Clear Filter
          </button>
        )}
      </div>
      <div className="border text-gray-500 w-full p-3 rounded-2xl overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-left text-[13px]">
            <tr className="border-b-2">
              <th className="p-2">No</th>
              <th className="p-2">ID KK</th>
              <th className="p-2">Nama KK</th>
              <th className="p-2">Alamat KK</th>
              <th className="p-2">Jumlah Anggota KK</th>
              <th className="p-2">Jumlah Score</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rowData) => (
              <tr key={rowData.id}>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.id}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.id_kk}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.nama_kk}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{rowData.alamat}</p>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.anggota}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <p className="text-[12px]">{rowData.score}</p>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1 border text-[12px] rounded-full px-2 py-1 ${getStatusColor(rowData.status)}`}>
                      <p className="text-[12px] drop-shadow-xl text-black-200">{rowData.status}</p>
                    </div>
                    <Link href={`/kk/${rowData.id_kk}`}>
                      <button
                        className="px-2 py-1 text-[12px] text-white rounded-full border border-gray-300 bg-primary">
                        Detail
                      </button>
                    </Link>
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

export default TableKK;
