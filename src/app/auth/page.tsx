"use client"
import React, { FormEvent, useRef, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorPopup from '../../components/ui/Error';

const Login: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showErrorComponent, setShowErrorComponent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage(result.error);
      setShowErrorComponent(true);
    } else {
      router.push('/');
    }
  };

  if (status === 'loading') {
    return null; 
  }

  return (
    <div className='loginbg'>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-full sm:w-96">
          <h1 className="text-xl font-bold mb-4 text-center">Administrator Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                ref={usernameRef}
                className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                ref={passwordRef}
                className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white text-sm p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              Login
            </button>
          </form>
          {showErrorComponent && <ErrorPopup message={errorMessage} />}
        </div>
      </div>
    </div>
  );
};

export default Login;
