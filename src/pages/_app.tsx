import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head'; 
import './styles/global.css';
import './styles/pagination.css';
import AppLayout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Dashboard Krembangan</title>
        <meta name="description" content="Dashboard Data Desa Krembangan" />
      </Head>
      
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </SessionProvider>
  );
}

export default MyApp;
