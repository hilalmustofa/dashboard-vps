"use client"

import PageNavbar, { PageNavbarIconButton, PageNavbarLeftContent, PageNavbarRightContent } from '../components/layout/PageNavbar'
import { Add, ExportCurve, Notification, Profile, SearchNormal1 } from 'iconsax-react'
import PageContent from '../components/layout/PageContent'
import { PrimaryButton, OutlineButton } from '../components/ui/Button'
import KKTable from '../components/table/TableKK'
import Link from 'next/link'


function KK() {

    return (
        <div className='text-gray-500 w-full'>
            <PageNavbar>
                <PageNavbarLeftContent>
                    <div className='border rounded-full w-10 h-10 all-center'>
                        <Profile size={18} />
                    </div>
                    <div>
                        <h1 className='text-[14px] font-semibold text-gray-800'>Data KK</h1>
                        <p className='text-[13px] font-medium'>Data yang ditampilkan berdasarkan kepala keluarga</p>
                    </div>
                </PageNavbarLeftContent>
            <div className='non-functional'>
                <PageNavbarRightContent>
                    <PageNavbarIconButton>
                        <SearchNormal1 size={16} />
                    </PageNavbarIconButton>
                    <PageNavbarIconButton>
                        <Notification size={16} />
                    </PageNavbarIconButton>
                </PageNavbarRightContent>
                </div>
            </PageNavbar>
            <PageContent>
                <div className='text-sm md:pb-2 flex items-center justify-between'>
                    <div>
                        <h1 className='text-gray-800 text-[14px] font-medium'>Tips</h1>
                        <p className='text-[13px]'>Klik pada detail KK untuk melihat data KK di dalam setiap KK di bawah</p>
                    </div>
                    <div className='flex gap-2'>
                        <OutlineButton className='hidden md:block'>
                            <ExportCurve size={16} />
                            <span className='hidden md:block text-xs'>
                                Export
                            </span>
                        </OutlineButton>

                        <Link href={'/kk/add'}>
                        <PrimaryButton>
                            <div className="flex items-center">
                                <Add size={16} className="hidden sm:inline" />
                                    <p className="text-xs leading-[0.80rem]">
                                    Tambah KK
                                    </p>
                            </div>
                        </PrimaryButton>
                        </Link>
                    </div>
                </div>
                <hr className='-mx-4' />
                <KKTable />
            </PageContent>
        </div>
    )
}

export default KK