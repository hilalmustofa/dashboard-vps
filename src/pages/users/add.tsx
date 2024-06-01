"use client"

import PageNavbar, { PageNavbarIconButton, PageNavbarLeftContent, PageNavbarRightContent } from '../../components/layout/PageNavbar'
import { Profile, SearchNormal1, Notification } from 'iconsax-react'
import PageContent from '../../components/layout/PageContent'
import { PrimaryButton } from '../../components/ui/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ErrorPopup from '../../components/ui/Error'

interface UserData {
    username: string;
    password: string;
    fullName: string;
    role: string;
    avatar: File | null;
}

function TambahUser() {
    const [userData, setUserData] = useState<UserData>({
        username: "",
        password: "",
        fullName: "",
        role: "",
        avatar: null,
    });
    const [showErrorComponent, setShowErrorComponent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();
    const { data: session } = useSession();
    const access_token = session?.user.access_token;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', userData.username);
            formData.append('password', userData.password);
            formData.append('fullName', userData.fullName);
            formData.append('role', userData.role);
            if (userData.avatar) {
                formData.append('avatar', userData.avatar);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                router.push("/users");
            } else {
                setErrorMessage(result.message);
                setShowErrorComponent(true);
                setTimeout(() => {
                    setShowErrorComponent(false);
                    setErrorMessage('');
                }, 5000);
            }

        } catch (error) {
            console.error("Error updating User data:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedFile(file);
        if (file) {
            setUserData((prevValues) => ({
                ...prevValues,
                avatar: file,
            }));
        }
    };

    return (
        <div className='text-gray-500 w-full'>
            <PageNavbar>
                <PageNavbarLeftContent>
                    <div className='border rounded-full w-10 h-10 all-center'>
                        <Profile size={18} />
                    </div>
                    <div>
                        <h1 className='text-[14px] font-semibold text-gray-800'>Tambah User</h1>
                        <p className='text-[13px] font-medium'>Menu untuk menambahkan data User</p>
                    </div>
                </PageNavbarLeftContent>

                <PageNavbarRightContent>
                    <PageNavbarIconButton>
                        <SearchNormal1 size={16} />
                    </PageNavbarIconButton>
                    <PageNavbarIconButton>
                        <Notification size={16} />
                    </PageNavbarIconButton>
                </PageNavbarRightContent>
            </PageNavbar>
            {showErrorComponent && <ErrorPopup message={errorMessage} />}

            <PageContent>
                <div className='text-sm md:pb-2 flex items-center justify-between'>
                    <div>
                        <h1 className='text-gray-800 text[14px] font-medium'>Tips</h1>
                        <p className='text-[13px]'>Harap mengisi data dengan teliti dan benar</p>
                    </div>
                </div>
                <hr className='-mx-4' />
                <form className="mt-4" onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan username"
                            value={userData.username}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan password"
                            value={userData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            placeholder="Masukkan nama lengkap"
                            value={userData.fullName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-gray-800">Role</label>
                        <select
                            name="role"
                            required
                            className="w-full border rounded-md px-3 py-2 text-[13px] mt-1"
                            value={userData.role}
                            onChange={(e) => setUserData((prevData) => ({ ...prevData, role: e.target.value }))}
                        >
                            <option disabled value="">
                                Pilih Role
                            </option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-[13px] font-medium text-gray-800 mt-4">Upload avatar user</label>
                        <label className="block text-[12px] mb-1"><i>Ukuran maksimal 2MB</i></label>
                        <div className="flex items-center">
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer bg-primary text-white py-1 px-2 rounded-md text-[13px]"
                            >
                                Choose File
                            </label>
                            <input
                                type="file"
                                required
                                id="fileInput"
                                accept=".jpg, .jpeg, .png"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {selectedFile && (
                                <span className="ml-2 text-[13px]">{selectedFile.name}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center text-[13px] justify-end mt-4">
                        <PrimaryButton type="submit">Simpan</PrimaryButton>
                    </div>
                </form>
            </PageContent>
        </div>
    )
}

export default TambahUser
