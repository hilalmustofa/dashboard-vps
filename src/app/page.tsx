"use client"
import ChartKemakmuran from '../components/Cards/ChartKemakmuran'
import ChartPekerjaan from '../components/Cards/ChartPekerjaan'
import InfoKemiskinan from '../components/Cards/InfoKemiskinan'
import InformasiBPJS from '../components/Cards/InformasiBPJS'
import ChartPendidikan from '../components/Cards/ChartPendidikan'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ChartPernikahan from '../components/Cards/ChartPernikahan'
import ChartJenisKelamin from '../components/Cards/ChartJenisKelamin'


function Home() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: session, status } = useSession();
  const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        }
    }, [status, session, router]);

  const handleSidebarChange = (value: boolean) => {
    setIsSidebarOpen(value)
  }

  return (
    <div
      className={`${isSidebarOpen ? 'overflow-hidden' : ''} h-screen`}
    >

      {/* backdrop */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsSidebarOpen(false)}
            className='bg-black/60 absolute top-0 left-0 md:hidden w-full h-screen z-20'
          />
        )}


      {/* mobile sidebar */}
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

      <div className='flex'>
        <div className='hidden md:block'>
          <Sidebar />
        </div>

        <div className='w-full max-w-[1440px] mx-auto'>
          <Navbar isOpen={isSidebarOpen} sidebarChange={handleSidebarChange} />

          <div className='p-4 md:p-6 space-y-4 columns-1 sm:columns-2 lg:columns-3'>

          <div className='break-inside-avoid-column space-y-4'>
              <ChartKemakmuran />
            </div>

            <div className='break-inside-avoid-column space-y-4'>
              <InfoKemiskinan />
            </div>

            <div className='break-inside-avoid-column space-y-4'>
              <ChartPendidikan />
            </div>

            <div className='break-inside-avoid-column space-y-4'>
              <ChartJenisKelamin />
            </div>

            <div className='break-inside-avoid-column space-y-4'>
              <ChartPernikahan />
            </div>
            <div className='break-inside-avoid-column space-y-4'>
              <ChartPekerjaan />
            </div>

            <div className='break-inside-avoid-column space-y-4'>
              <InformasiBPJS />
            </div>
            
          </div>
          </div>

        </div>
    </div>
  )
}

export default Home