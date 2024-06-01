"use client"

import PageNavbar, { PageNavbarIconButton, PageNavbarLeftContent, PageNavbarRightContent } from '../../components/layout/PageNavbar'
import { Add, ExportCurve, Notification, Profile, SearchNormal1 } from 'iconsax-react'
import PageContent from '../../components/layout/PageContent'
import { PrimaryButton, OutlineButton } from '../../components/ui/Button'
import RadioButton from '../..//components/ui/Radio'
import { useState } from 'react'
import { useSession } from 'next-auth/react';
import { values } from '../../components/Questions'
import { useRouter } from 'next/navigation'
import ErrorPopup from '../..//components/ui/Error'

function TambahKK() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showErrorComponent, setShowErrorComponent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState<{
    nomor_kk: string;
    nama_kk: string;
    alamat: string;
    nama_cp: string;
    kontak_cp: string;
    rumah: string;
    luas: string;
    lantai: string;
    dinding: string;
    atap: string;
    kondisi: string;
    air: string;
    penerangan: string;
    energi: string;
    mck: string;
    jamban: string;
    limbah: string;
    anggaran_makan: string;
    anggaran_pakaian: string;
    anggaran_daging: string;
    terdaftar_kis: string;
    jaminan_kesehatan: string;
    disabilitas: string;
    penyakit: string;
    ijazah_tertinggi: string;
    tanggungan: string;
    pekerjaan_utama: string;
    jumlah_berpenghasilan: string;
    jumlah_pendapatan: string;
    aset_elektronik: string;
    aset_kendaraan: string;
    jenis_kendaraan: string;
    jumlah_kendaraan: string;
    aset_lain: string;
    hewan_ternak: string;
    foto_1: File | null;  
    foto_2: File | null;  
    foto_3: File | null;  
  }>({
    nomor_kk: '',
    nama_kk: '',
    alamat: '',
    nama_cp: '',
    kontak_cp: '',
    rumah: '',
    luas: '',
    lantai: '',
    dinding: '',
    atap: '',
    kondisi: '',
    air: '',
    penerangan: '',
    energi: '',
    mck: '',
    jamban: '',
    limbah: '',
    anggaran_makan: '',
    anggaran_pakaian: '',
    anggaran_daging: '',
    terdaftar_kis: '',
    jaminan_kesehatan: '',
    disabilitas: '',
    penyakit: '',
    ijazah_tertinggi: '',
    tanggungan: '',
    pekerjaan_utama: '',
    jumlah_berpenghasilan: '',
    jumlah_pendapatan: '',
    aset_elektronik: '',
    aset_kendaraan: '',
    jenis_kendaraan: '',
    jumlah_kendaraan: '',
    aset_lain: '',
    hewan_ternak: '',
    foto_1: null,  
    foto_2: null,  
    foto_3: null,  
  });
  

  const handleOptionChange = (key: any, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleKKChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      nomor_kk: value,
    }));
  };
  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      nama_kk: value,
    }));
  };
  const handleAlamatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      alamat: value,
    }));
  };
  const handleNamaCPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      nama_cp: value,
    }));
  };
  const handleKontakCPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      kontak_cp: value,
    }));
  };
 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setFormValues((prevValues) => ({
        ...prevValues,
        foto: file,
      }));
    }
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const accessToken = session?.user.access_token;
    if (!accessToken) {
      console.error("Access token not available");
      return;
    }
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const result = await response.json();
  
      if (response.ok) {
        router.push('/kk')
      } else {
        setErrorMessage(result.message);
        setShowErrorComponent(true);
        setTimeout(() => {
            setShowErrorComponent(false);
            setErrorMessage('');
        }, 5000);
    }
    } catch (error) {
      console.error('An error occurred while making the API request', error);
    }
  };
  

  
  return (
    <div className='text-gray-500 w-full'>
      <PageNavbar>
        <PageNavbarLeftContent>
          <div className='border rounded-full w-10 h-10 all-center'>
            <Profile size={18} />
          </div>
          <div>
            <h1 className='text-sm font-semibold text-gray-800'>Tambah KK</h1>
            <p className='text-xs font-medium'>Menu untuk menambahkan data KK</p>
          </div>
        </PageNavbarLeftContent>

        <PageNavbarRightContent>
          <PageNavbarIconButton>
            <SearchNormal1 size={16} />
          </PageNavbarIconButton>
          <PageNavbarIconButton>
            <Notification size={16} />
          </PageNavbarIconButton>
        </PageNavbarRightContent>
      </PageNavbar>
      {showErrorComponent && <ErrorPopup message={errorMessage} />}

      <PageContent>

        <div className='text-sm md:pb-2 flex items-center justify-between'>
          <div>
            <h1 className='text-gray-800 text[14px] font-medium'>Tips</h1>
            <p className='text-[13px]'>Harap mengisi data dengan teliti dan benar</p>
          </div>
        </div>
        <hr className='-mx-4' />
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-800">Nomer KK</label>
            <input
              type="text"
              required
              className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
              placeholder="Masukkan nomer KK"
              onChange={handleKKChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-800">Nama Kepala Keluarga</label>
            <input
              type="text"
              required
              className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
              placeholder="Masukkan nama kepala keluarga"
              onChange={handleNamaChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-800">Alamat KK</label>
            <input
              type="text"
              required
              className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
              placeholder="Masukkan alamat KK"
              onChange={handleAlamatChange}
            />
          </div>
          <label className="block text-[14px] font-medium mt-4 mb-4">Informasi Kontak</label>
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-800">Nama</label>
            <input
              type="text"
              required
              className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
              placeholder="Masukkan nama kontak"
              onChange={handleNamaCPChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-800">No. HP</label>
            <input
              type="text"
              required
              className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
              placeholder="Masukkan nomer hp kontak"
              onChange={handleKontakCPChange}
            />
          </div>

          <RadioButton data={values} onOptionChange={handleOptionChange} />

          <div className="mb-4 relative">
            <label className="block text-[13px] font-medium text-gray-800 mt-4">Upload foto rumah</label>
            <label className="block text-[12px] mb-1"><i>Ukuran maksimal 5MB</i></label>
            <div className="flex items-center">
              <label
                htmlFor="fileInput"
                className="cursor-pointer bg-primary text-white py-1 px-2 rounded-md text-[13px]"
              >
                Choose File
              </label>
              <input
                type="file"
                required
                id="fileInput"
                accept=".jpg, .jpeg, .png"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile && (
          <span className="ml-2 text-[13px]">{selectedFile.name}</span>
        )}
            </div>
          </div>
          <div className="flex items-center justify-end mt-4">
            <PrimaryButton type="submit">Simpan</PrimaryButton>
          </div>
        </form>

      </PageContent>

    </div>
  )
}

export default TambahKK