import dynamic from 'next/dynamic';

interface NoSsrProps {
  children: React.ReactNode;
}

const NoSsr: React.FC<NoSsrProps> = ({ children }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSsr), { ssr: false });