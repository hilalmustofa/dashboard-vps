"use client"

import PageNavbar, { PageNavbarIconButton, PageNavbarLeftContent, PageNavbarRightContent } from '../components/layout/PageNavbar'
import { Add, Notification, Profile, SearchNormal1 } from 'iconsax-react'
import PageContent from '../components/layout/PageContent'
import TableUser from '../components/table/TableUser'
import Link from 'next/link'
import { PrimaryButton } from '../components/ui/Button'

function Users() {
    return (
        <div className='text-gray-500 w-full'>
            <PageNavbar>
                <PageNavbarLeftContent>
                    <div className='border rounded-full w-10 h-10 all-center'>
                        <Profile size={18} />
                    </div>
                    <div>
                        <h1 className='text-[14px] font-semibold text-gray-800'>Data Users</h1>
                        <p className='text-[13px] font-medium'>Data user hanya berhak diakses oleh Superuser</p>
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
                        <p className='text-[13px]'>Superuser tidak bisa menghapus diri sendiri</p>
                    </div>
                    <div className='flex gap-2'>
                        <Link href={'/users/add'}>
                        <PrimaryButton>
                            <div className="flex items-center">
                                <Add size={16} className="hidden sm:inline" />
                                    <p className="text-xs leading-[0.80rem]">
                                    Tambah User
                                    </p>
                            </div>
                        </PrimaryButton>
                        </Link>
                    </div>
                </div>
                <TableUser />
            </PageContent>

        </div>
    )
}

export default Users