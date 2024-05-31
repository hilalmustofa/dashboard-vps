"use client"

import PageNavbar, { PageNavbarIconButton, PageNavbarLeftContent, PageNavbarRightContent } from '../components/layout/PageNavbar'
import { Notification, Profile, SearchNormal1 } from 'iconsax-react'
import PageContent from '../components/layout/PageContent'
import WargaTable from '../components/table/TableWarga'

function Warga() {
    return (
        <div className='text-gray-500 w-full'>
            <PageNavbar>
                <PageNavbarLeftContent>
                    <div className='border rounded-full w-10 h-10 all-center'>
                        <Profile size={18} />
                    </div>
                    <div>
                        <h1 className='text-[14px] font-semibold text-gray-800'>Data Warga</h1>
                        <p className='text-[13px] font-medium'>Data yang ditampilkan berdasarkan individual warga</p>
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
                <WargaTable />
            </PageContent>

        </div>
    )
}

export default Warga