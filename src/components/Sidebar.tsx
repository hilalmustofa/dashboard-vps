import Image from 'next/image'
import { getSession, useSession, signOut } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ArrowRight2, Calendar, Document, Element3, Folder2, Headphone, User, Profile2User, Setting2, Setting4, Star, Timer1, Triangle, UserAdd } from 'iconsax-react'
import ProfileImage from '../components/assets/sync.svg';
import Logo from '../components/assets/logos/logo.png'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface SidebarProps {
    serverSession?: {
        user: {
            avatar?: string;
            fullName?: string;
            role?: string;
        };
    };
}


function Sidebar({ serverSession }: SidebarProps) {
    const pathname = usePathname()
    const [showLogoutButton, setShowLogoutButton] = useState(false);
    const { data: session } = useSession();
    const currentSession = serverSession || session;

    const handleContextMenu = () => {
        setShowLogoutButton(!showLogoutButton);
    };

    return (
        <div className='w-60 shrink-0 md:block h-screen sticky top-0 overflow-hidden'>
            <div className='w-full h-full bg-white border'>
                <Link href={'/'}>
                <div className='p-4 md:p-6 flex cursor-pointer group items-center gap-2'>
                    <div className='flex items-center justify-center rounded-full'>
                        <Image src={Logo} width={40} alt='logo' className='relative group-hover:scale-75 duration-200' />
                    </div>
                    <div>
                        <h1 className='text-sm font-bold text-gray-800'>Krembangan</h1>
                        <p className='text-xs text-gray-500 font-medium'>Warga Management</p>
                    </div>
                </div>
                </Link>

                <hr className='bg-gray-400 mx-2' />
                <div className='flex flex-col h-full justify-between'>
                    <div className='pt-6 text-gray-500 font-medium space-y-2 md:px-2 text-[14px]'>
                        <Link href={'/'} className={`flex ${pathname === '/' ? 'text-primary' : ''} hover:px-8 duration-200 rounded-md w-full py-1 px-6 items-center gap-2`}>
                            <Element3 variant='Outline' size={16} />
                            Dashboard
                        </Link>

                        <Link href={'/kk'} className={`flex ${pathname === '/kk' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <User size={16} />
                            Data KK
                        </Link>

                        <Link href={'/warga'} className={`flex ${pathname === '/warga' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <Profile2User size={16} />
                            Data Warga
                        </Link>

                        <Link href={'/users'} className={`flex ${pathname === '/users' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <UserAdd size={16} />
                            Data Users
                        </Link>

                        <Link href={'/integrations'} className={`flex ${pathname === '/integrations' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <Triangle size={16} />
                            Integrations
                        </Link>

                        <button className={`flex ${pathname === '/calendar' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <Calendar size={16} />
                            Calendar
                        </button>

                        <button className={`flex ${pathname === '/timeoff' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <Timer1 size={16} />
                            Time Off
                        </button>

                        <button className={`flex ${pathname === '/projects' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <Folder2 size={16} />
                            Projects
                        </button>

                        <button className={`flex ${pathname === '/benefits' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <Star size={16} />
                            Benefits
                        </button>

                        <button className={`flex ${pathname === '/documents' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                            <Document size={16} />
                            Documents
                        </button>
                    </div>

                    <div>
                        <div className='text-gray-500 text-[13px] font-medium md:px-2'>
                            <button className={`flex ${pathname === '/settings' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                                <Setting2 size={16} />
                                Settings
                            </button>

                            <button className={`flex ${pathname === '/support' ? 'text-primary' : ''} hover:px-8 duration-200 px-6 py-1 items-center gap-2`}>
                                <Headphone size={16} />
                                Support
                            </button>
                        </div>

                        <hr className='bg-gray-400 mx-2 my-4' />

                        <div className='flex pb-28 justify-between px-4 md:px-6 items-center hover:pr-5 duration-200'>
                            {showLogoutButton ? (
                                <button className='text-white rounded rounded-md text-[13px] font-medium bg-red-600 px-4 py-2' onClick={() => signOut()}>
                                    Logout
                                </button>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Image
                                        src={currentSession?.user.avatar ?? ProfileImage}
                                        alt='User'
                                        width={50}
                                        height={50}
                                        className='rounded-full'
                                    />

                                    <div className=''>
                                        <p className='text-sm font-semibold text-gray-800'>{currentSession?.user.fullName}</p>
                                        <p className='text-[12px] text-gray-500'>{currentSession?.user.role}</p>
                                    </div>
                                </div>
                            )}

                            <button className='text-gray-500' onClick={handleContextMenu}>
                                <ArrowRight2 size={16} />
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default Sidebar