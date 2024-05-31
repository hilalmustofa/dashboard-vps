"use client"

import PageNavbar, { PageNavbarIconButton, PageNavbarLeftContent, PageNavbarRightContent } from '../../components/layout/PageNavbar'
import { Add, ExportCurve, Notification, Profile, SearchNormal1 } from 'iconsax-react'
import PageContent from '../../components/layout/PageContent'
import { PrimaryButton, OutlineButton } from '../../components/ui/Button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ErrorPopup from '../../components/ui/Error'

interface WargaData {
    nik: string;
    nomor_kk: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    rt: string;
    rw: string;
    agama: string;
    status_perkawinan: string;
    pendidikan_terakhir: string;
    hubungan: string;
}

function TambahWarga() {
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedAgama, setSelectedAgama] = useState("");
    const [selectedKawin, setSelectedKawin] = useState("");
    const [selectedPendidikan, setSelectedPendidikan] = useState("");
    const [selectedHubungan, setSelectedHubungan] = useState("");
    const [showErrorComponent, setShowErrorComponent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [wargaData, setWargaData] = useState<WargaData>({
        nik: "",
        nomor_kk: "",
        nama: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        alamat: "",
        rt: "",
        rw: "",
        agama: "",
        status_perkawinan: "",
        pendidikan_terakhir: "",
        hubungan: "",
    });
    const router = useRouter();
    const { data: session, status } = useSession();
    const access_token = session?.user.access_token;


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nik: wargaData.nik,
                nomor_kk: wargaData.nomor_kk,
                nama: wargaData.nama,
                tempat_lahir: wargaData.tempat_lahir,
                tanggal_lahir: wargaData.tanggal_lahir,
                jenis_kelamin: selectedGender,
                alamat: wargaData.alamat,
                rt: wargaData.rt,
                rw: wargaData.rw,
                agama: selectedAgama,
                status_perkawinan: selectedKawin,
                pendidikan_terakhir: selectedPendidikan,
                hubungan: selectedHubungan,
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/nik`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + access_token,
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok) {
                console.log("Warga data updated:", result);
                router.push("/warga");
            }
            else {
                setErrorMessage(result.message);
                setShowErrorComponent(true);
                setTimeout(() => {
                    setShowErrorComponent(false);
                    setErrorMessage('');
                }, 5000);
            }
            
        } catch (error) {
            console.error("Error updating Warga data:", error);
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
                        <h1 className='text-[14px] font-semibold text-gray-800'>Tambah Warga</h1>
                        <p className='text-[13px] font-medium'>Menu untuk menambahkan data Warga</p>
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
                <form className="mt-4" onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">NIK</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan nama warga"
                            value={wargaData.nik}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, nik: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Nomor KK</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan nomor kk warga"
                            value={wargaData.nomor_kk}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, nomor_kk: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Nama Anggota Keluarga</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan alamat warga"
                            value={wargaData.nama}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, nama: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Tempat Lahir</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan alamat warga"
                            value={wargaData.tempat_lahir}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, tempat_lahir: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Tanggal Lahir</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan alamat warga"
                            value={wargaData.tanggal_lahir}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, tanggal_lahir: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Jenis Kelamin</label>
                        <select
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            required
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                        >
                            <option disabled value="">
                                Pilih Jenis Kelamin
                            </option>
                            <option value="Laki-Laki">Laki-Laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>


                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Alamat</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan alamat warga"
                            value={wargaData.alamat}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, alamat: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">RT</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan RT warga"
                            value={wargaData.rt}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, rt: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">RW</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan RW warga"
                            value={wargaData.rw}
                            onChange={(e) => setWargaData((prevData) => ({ ...prevData, rw: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Agama</label>
                        <select
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            value={selectedAgama}
                            onChange={(e) => setSelectedAgama(e.target.value)}
                        >
                            <option disabled value="">
                                Pilih Agama
                            </option>
                            <option value="islam">Islam</option>
                            <option value="kristen">Kristen</option>
                            <option value="hindu">Hindu</option>
                            <option value="buddha">Buddha</option>
                            <option value="khonghucu">Khonghucu</option>
                        </select>
                    </div>


                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Status Perkawinan</label>
                        <select className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            required
                            value={selectedKawin}
                            onChange={(e) => setSelectedKawin(e.target.value)}
                        >
                            <option disabled value="">
                                Pilih Status Perkawinan
                            </option>
                            <option value="kawin">Kawin</option>
                            <option value="kawin">Kawin Tercatat</option>
                            <option value="belum kawin">Belum Kawin</option>
                            <option value="cerai">Cerai Mati</option>
                            <option value="cerai">Cerai Hidup</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Pendidikan Terakhir</label>
                        <select className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            required
                            value={selectedPendidikan}
                            onChange={(e) => setSelectedPendidikan(e.target.value)}
                        >
                            <option disabled value="">
                                Pilih Pendidikan Terakhir
                            </option>
                            <option value="tidak sekolah">Tidak Sekolah</option>
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>
                            <option value="SMA">SMA</option>
                            <option value="D3">D3</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Hubungan Keluarga</label>
                        <select className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            required
                            value={selectedHubungan}
                            onChange={(e) => setSelectedHubungan(e.target.value)}
                        >
                            <option disabled value="">
                                Pilih Hubungan Keluarga
                            </option>
                            <option value="Kepala Keluarga">Kepala Keluarga</option>
                            <option value="Istri">Istri</option>
                            <option value="Anak">Anak</option>
                            <option value="Orang Tua">Orang Tua</option>
                            <option value="Mertua">Mertua</option>
                            <option value="Menantu">Menantu</option>
                            <option value="Kakek">Kakek</option>
                            <option value="Nenek">Nenek</option>
                            <option value="Famili Lain">Famili Lain</option>
                        </select>
                    </div>

                    <div className="flex items-center text-[13px] justify-end mt-4">
                        <PrimaryButton type="submit">Simpan</PrimaryButton>
                    </div>
                </form>
            </PageContent>
        </div>
    )
}

export default TambahWarga