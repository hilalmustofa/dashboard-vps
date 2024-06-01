import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../../components/Cards/ui/Barloader';
import Pagination from '../Pagination';
import ErrorPopup from '../../components/ui/Error';

interface UserData {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

function TableUser() {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [showErrorComponent, setShowErrorComponent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = session?.user?.access_token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/list?page=${currentPage + 1}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const result = await response.json();

        if (response.ok) {
          setData(result.data);
          setTotalPages(result.total_pages);
          setLoading(false);
        } else {
          router.push('/auth');
        }
      } catch (error) {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, currentPage, router]);

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
  };

  const confirmDelete = async (id: number) => {
    try {
      const access_token = session?.user?.access_token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ user_id: id }),
      });
      const result = await response.json();

      if (response.ok) {
        setData(data.filter((user) => user.id !== id));
        setUserToDelete(null);
      } else {
        setShowErrorComponent(true);
        setErrorMessage(result.message);
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  if (loading) {
    return <Loading loading={loading} color="#7B6CF0" />;
  }

  return (
    <>
      <div className="border text-gray-500 w-full p-3 rounded-2xl overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-left text-[13px]">
            <tr className="border-b-2">
              <th className="p-2">No</th>
              <th className="p-2">Username</th>
              <th className="p-2">Full Name</th>
              <th className="p-2">Role</th>
              <th className="p-2 w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={user.id}>
                <td className="p-2">
                  <p className="text-[12px]">{index + 1}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{user.username}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{user.fullName}</p>
                </td>
                <td className="p-2">
                  <p className="text-[12px]">{user.role}</p>
                </td>
                <td className="p-2">
                  <div className="flex justify-start items-center">
                    {userToDelete === user.id ? (
                      <div className="flex space-x-1">
                        <button
                          className="px-2 py-1 text-[12px] text-white rounded-full border border-gray-300 bg-red-500"
                          onClick={() => confirmDelete(user.id)}
                        >
                          Yes
                        </button>
                        <button
                          className="px-2 py-1 text-[12px] text-white rounded-full border border-green-300 bg-green-500"
                          onClick={cancelDelete}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        className="px-2 py-1 text-[12px] text-white rounded-full border border-gray-300 bg-red-500 w-[60px]" // Fixed width for button
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showErrorComponent && <ErrorPopup message={errorMessage} />}
      <Pagination
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page - 1)}
      />
    </>
  );
}

export default TableUser;
