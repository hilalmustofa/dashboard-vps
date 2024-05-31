"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "../components/Sidebar"
import { useCentralStore } from "../Store"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { isSidebarOpen, toggleSidebar, setIsSidebarOpen } = useCentralStore()
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        }
    }, [status, session, router]);

    return (
        <div
            className={`${isSidebarOpen ? 'overflow-hidden' : ''} h-screen`}
        >
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className='bg-black/60 absolute top-0 left-0 md:hidden w-full h-screen z-20'
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
                        className='absolute md:hidden z-30 top-0 left-0'
                    >
                        <Sidebar />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='grid md:grid-cols-[240px_1fr] w-screen overflow-x-hidden'>
                <div className='hidden md:block'>
                    <Sidebar />
                </div>

                <div className='w-full overflow-x-auto max-w-[1440px] mx-auto'>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default AppLayout;