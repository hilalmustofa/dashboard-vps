import React, { useState } from 'react';
import ProfileImage from '../components/assets/sync.svg';
import { Add, CalendarEdit, DirectNotification, SearchNormal1, SidebarLeft } from 'iconsax-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import FloatingTooltip from './ui/Tooltip';

interface NavbarProps {
    isOpen: boolean;
    sidebarChange: (value: boolean) => void;
    serverSession?: {
        user: {
            avatar?: string;
            fullName?: string;
        };
    };
}

function Navbar({ isOpen, sidebarChange, serverSession }: NavbarProps) {
    const { data: session, status } = useSession();
    const currentSession = serverSession || session;
    const [tooltipMessage, setTooltipMessage] = useState<string>('');
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const showTooltip = (message: string, position: { top: number; left: number }) => {
        setTooltipMessage(message);
        setTooltipPosition(position);
        setTimeout(() => {
            setTooltipMessage('');
        }, 3000);
    };

    const handleButtonClick = (message: string, event: React.MouseEvent<HTMLButtonElement>) => {
        showTooltip(message, { top: event.clientY, left: event.clientX });
    };

    return (
        <div>
            <div className='flex p-4 md:p-6 justify-between items-center'>
                <div className='flex items-center justify-between gap-2'>
                    <Image
                        src={currentSession?.user.avatar ?? ProfileImage}
                        alt='User'
                        width={50}
                        height={50}
                        className='rounded-full'
                    />

                    <div className=''>
                        <p className='text-[14px] font-semibold text-gray-800'>{currentSession?.user.fullName}</p>
                        <p className='text-[13px] font-medium text-gray-500'>Welcome back</p>
                    </div>
                </div>

                <button onClick={() => sidebarChange(!isOpen)} className='all-center text-gray-500 h-8 w-8 md:hidden'>
                    <SidebarLeft size={16} />
                </button>

                <div className='text-gray-500 hidden md:flex gap-2'>
                    <button className='all-center h-8 w-8 duration-200 hover:bg-gray-100 rounded-lg' onClick={(e) => handleButtonClick('Search is not working yet', e)}>
                        <SearchNormal1 size={16} />
                    </button>

                    <button className='all-center h-8 w-8 duration-200 hover:bg-gray-100 rounded-lg' onClick={(e) => handleButtonClick('Notification is not working yet', e)}>
                        <DirectNotification size={16} />
                    </button>

                    <button className='h-8 w-8 gap-1 md:w-auto md:border py-1 px-2 duration-200 hover:bg-gray-100 rounded-lg text-[13px] all-center' onClick={(e) => handleButtonClick('Schedule is not working yet', e)}>
                        <CalendarEdit size={16} />
                        <span className='hidden md:inline'>Schedule</span>
                    </button>

                    <button className='h-8 gap-1 bg-primary hidden py-1 px-2 duration-200 text-white rounded-lg text-[13px] md:flex items-center justify-center' onClick={(e) => handleButtonClick('Request is not working yet', e)}>
                        <Add size={16} />
                        <span className='hidden md:inline'>Create request</span>
                    </button>
                    {tooltipMessage && <FloatingTooltip message={tooltipMessage} position={tooltipPosition} />}
                </div>
            </div>

            <hr className='bg-gray-400 mx-2' />

        </div>
    )
}

export default Navbar