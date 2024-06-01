"use client"
import React, { useState, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Hierarchy, InfoCircle, Profile, SearchNormal1 } from 'iconsax-react';
import { PrimaryButton, OutlineButton } from '../../components/ui/Button'
import { values } from '../../components/Questions';
import ModalImage from 'react-modal-image';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import PageNavbar, { PageNavbarIconButton, PageNavbarLeftContent, PageNavbarRightContent } from '../../components/layout/PageNavbar';
import PageContent from '../../components/layout/PageContent';


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);
    const { id } = context.params || {};

    if (!session || !id) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false,
            },
        };
    }

    const access_token = session.user?.access_token;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/kk?id=${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const data = await response.json();

        if (!data.data) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                data: data.data,
                serverSession: {
                    user: {
                        avatar: session.user.avatar,
                        fullName: session.user.fullName,
                    },
                },
            },
        };
    } catch (error) {
        console.error('Error fetching KK data:', error);

        return {
            notFound: true,
        };
    }
};



const DetailKK = ({ data, serverSession }: { data: any; serverSession: any }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const handleSidebarChange = (value: boolean) => {
        setIsSidebarOpen(value);
    };


    const handleEditClick = () => {
        router.push(`/kk/edit/${data.nomor_kk}`);
    };

    const getLabel = (key: string, value: { toString: () => string; }) => {
        const questionSet = values.find((set) => set.options.some((option) => option.key === key));
        if (questionSet) {
            const option = questionSet.options.find((option) => option.key === key);
            if (option) {
                const selectedOption = option.options.find((opt) => opt.value.toString() === value.toString());
                return selectedOption ? selectedOption.label : '';
            }
        }
        return '';
    };

    return (
        <div className='w-full max-w-[1440px] mx-auto'>
            <PageNavbar>
                <PageNavbarLeftContent>
                    <div className='border rounded-full w-10 h-10 all-center'>
                        <Profile size={18} />
                    </div>
                    <div>
                        <h1 className='text-sm font-semibold text-gray-800'>Detail KK</h1>
                        <p className='text-xs'>Berikut adalah detail dari KK </p> <p className='text-blue-500 text-xs font-medium'>{data.nomor_kk}</p>
                    </div>
                </PageNavbarLeftContent>

                <PageNavbarRightContent>
                    <PageNavbarIconButton>
                        <SearchNormal1 size={16} />
                    </PageNavbarIconButton>
                    <PageNavbarIconButton>
                    </PageNavbarIconButton>
                </PageNavbarRightContent>
            </PageNavbar>

            <PageContent>
                <div className='border text-gray-500 w-full p-3 rounded-2xl'>
                    <div className='flex justify-between items-start mb-4'>
                        <div className='flex'>
                            <div className='flex flex-col items-center mr-8'>
                                <div style={{ width: 256, height: 144, overflow: 'hidden', borderRadius: '16px' }}>
                                    <ModalImage
                                        small={data.foto_1}
                                        large={data.foto_1}
                                        alt='Tampak Depan'
                                        className='rounded-2xl cursor-pointer'
                                        hideZoom={true}
                                    />
                                </div>
                                <p className='text-[14px] text-gray-400 font-medium'>Tampak Depan</p>
                            </div>
                            <div className='flex flex-col items-center mr-8'>
                                <div style={{ width: 256, height: 144, overflow: 'hidden', borderRadius: '16px' }}>
                                    <ModalImage
                                        small={data.foto_2}
                                        large={data.foto_2}
                                        alt='Tampak Samping'
                                        className='rounded-2xl cursor-pointer'
                                        hideZoom={true}
                                    />
                                </div>
                                <p className='text-[14px] text-gray-400 font-medium'>Tampak Samping</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div style={{ width: 256, height: 144, overflow: 'hidden', borderRadius: '16px' }}>
                                    <ModalImage
                                        small={data.foto_3}
                                        large={data.foto_3}
                                        alt='Tampak Belakang'
                                        className='rounded-2xl cursor-pointer'
                                        hideZoom={true}
                                    />
                                </div>
                                <p className='text-[14px] text-gray-400 font-medium'>Tampak Belakang</p>
                            </div>
                        </div>
                        <div className='flex-shrink-0'>
                            <PrimaryButton onClick={handleEditClick}>
                                Edit Data
                            </PrimaryButton>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[13px] text-gray-400 font-medium'>Anggota Keluarga</p>
                        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {data.nik.map((member: any) => (
                                <li key={member.id} className='border p-2 rounded-md'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <Hierarchy size={16} />
                                        <p className='text-gray-800 font-medium text-[14px]'>{member.nama}</p>
                                    </div>
                                    <hr className='bg-gray-400 my-1' />
                                    <span className='text-[14px]'>Jenis Kelamin:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.jenis_kelamin}
                                    </p>
                                    <span className='text-[14px]'>Pekerjaan:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.pekerjaan}
                                    </p>
                                    <span className='text-[14px]'>Tempat Lahir:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.tempat_lahir}
                                    </p>
                                    <span className='text-[14px]'>Tanggal Lahir:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.tanggal_lahir}
                                    </p>
                                    <span className='text-[14px]'>Alamat:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.alamat}
                                    </p>
                                    <span className='text-[14px]'>RT:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.rt}
                                    </p>
                                    <span className='text-[14px]'>RW:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.rw}
                                    </p>
                                    <span className='text-[14px]'>Agama:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.agama}
                                    </p>
                                    <span className='text-[14px]'>Status Perkawinan:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.status_perkawinan}
                                    </p>
                                    <span className='text-[14px]'>Pendidikan Terakhir:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.pendidikan_terakhir}
                                    </p>
                                    <span className='text-[14px]'>Hubungan Keluarga:</span>
                                    <p className='text-[13px] font-[440] text-gray-800'>
                                        {member.hubungan}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='space-y-1 mb-4 mt-2'>
                        <p className='text-[14px] text-gray-400 font-medium'>Alamat</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{data.alamat}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Nama CP</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{data.nama_cp}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Nomor CP</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{data.kontak_cp}</p>
                        </div>
                    </div>

                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Status kepemilikan rumah/tempat tinggal</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('rumah', data.rumah)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Luas bangunan tempat tinggal</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('luas', data.luas)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jenis lantai rumah utama (rumah utama bukan dapur)</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('lantai', data.lantai)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jenis atap rumah utama terluas</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('atap', data.atap)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Kondisi rumah utama secara keseluruhan</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('kondisi', data.kondisi)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Sumber air utama terbanyak yang digunakan untuk memasak atau MC</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('air', data.air)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Sumber penerangan utama</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('penerangan', data.penerangan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Sumber energi utama untuk memasak yang digunakan</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('energi', data.energi)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Kepemilikan fasilitas MCK</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('mck', data.mck)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jenis jamban utama yang digunakan</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('jamban', data.jamban)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Tempat pembuangan limbah cair sisa mandi/cuci</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('limbah', data.limbah)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'> Kesulitan untuk memenuhi anggaran makan minimal 3x sehari seluruh anggota keluarga</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('anggaran_makan', data.anggaran_makan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Kesulitan untuk memenuhi anggaran pembelian pakaian seluruh anggota keluarga untuk 6 bulan sekali</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('anggaran_pakaian', data.anggaran_pakaian)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Kesulitan untuk memenuhi anggaran pembelian daging/protein hewani seluruh anggota keluarga untuk seminggu sekali</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('anggaran_daging', data.anggaran_daging)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Anggota Keluarga terdaftar KIS</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('terdaftar_kis', data.terdaftar_kis)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jenis jaminan Kesehatan</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('jaminan_kesehatan', data.jaminan_kesehatan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Anggota Keluarga dengan disabilitas</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('disabilitas', data.disabilitas)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Anggota keluarga dengan penyakit kronis/menahun</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('penyakit', data.penyakit)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Ijazah tertinggi yang dimiliki anggota keluarga</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('ijazah_tertinggi', data.ijazah_tertinggi)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jumlah anggota keluarga yang masih menjadi tanggungan Kepala Keluarga/penanggung jawab dengan rentang usia 6 s.d. 19 tahun</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('tanggungan', data.tanggungan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Pekerjaan utama Kepala Keluarga/Penanggung Jawab Keluarga</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('pekerjaan_utama', data.pekerjaan_utama)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jumlah total anggota keluarga termasuk kepala keluarga/penanggung jawab keluarga yang berpenghasilan</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('jumlah_berpenghasilan', data.jumlah_berpenghasilan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jumlah total Pendapatan Kepala Keluarga/Penanggung jawab keluarga dan anggota keluarga dibagi jumlah seluruh anggota keluarga selama 6 bulan terakhir</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('jumlah_pendapatan', data.jumlah_pendapatan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Rumah tangga memiliki aset elektronik (TV Flat di atas 20 inch, kulkas, mesin cuci, laptop/komputer, AC)</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('aset_elektronik', data.aset_elektronik)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Kepemilikan transportasi bermotor/bermesin dalam satu rumah</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('aset_kendaraan', data.aset_kendaraan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Jenis alat transportasi (Motor) dengan volume kubikasi tertinggi dalam satu rumah</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('jenis_kendaraan', data.jenis_kendaraan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Kepemilikan alat transportasi (Mobil/Truck/PickUp dll)</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('jumlah_kendaraan', data.jumlah_kendaraan)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'>Kepemilikan Asset tidak bergerak di tempat lain (tidak termasuk lahan/bangunan yang sekarang ditempati)</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('aset_lain', data.aset_lain)}</p>
                        </div>
                    </div>
                    <div className='space-y-1 mb-4'>
                        <p className='text-[14px] text-gray-400 font-medium'> Kepemilikan Hewan ternak (hitung seluruh harga jual ternak yang dimiliki)</p>
                        <div className='text-[13px] font-[440] flex items-center gap-2'>
                            <p className='text-gray-800'>{getLabel('hewan_ternak', data.hewan_ternak)}</p>
                        </div>
                    </div>

                </div>
            </PageContent>
        </div>
    );
}



export default DetailKK;
