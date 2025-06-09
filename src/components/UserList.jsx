import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import UserForm from './UserForm';

const formatTimezone = (seconds) => {
    const hours = seconds / 3600;
    const absoluteHours = Math.abs(hours);
    const sign = hours < 0 ? '-' : '+';
    return `UTC${sign}${Math.floor(absoluteHours)}`;
};

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (_error) {
            toast.error('Failed to load users');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                toast.success('User deleted successfully');
                loadUsers();
            } catch (_error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (userData) => {
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, userData);
                toast.success('User updated successfully');
            } else {
                await userService.createUser(userData);
                toast.success('User created successfully');
            }
            setIsFormOpen(false);
            loadUsers();
        } catch (_error) {
            toast.error(editingUser ? 'Failed to update user' : 'Failed to create user');
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all users in the system
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center justify-center rounded-md border border-transparent 
                                 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm 
                                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                 focus:ring-offset-2 sm:w-auto transition-colors duration-200 cursor-pointer"
                    >
                        Add user
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ZIP</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Latitude</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Longitude</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Timezone</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{user.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.zip}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.latitude}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.longitude}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatTimezone(user.timezone)}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer 
                                                             transition-colors duration-200 p-2 rounded-full 
                                                             hover:bg-indigo-50 mr-2"
                                                    title="Edit user"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-900 cursor-pointer 
                                                             transition-colors duration-200 p-2 rounded-full 
                                                             hover:bg-red-50"
                                                    title="Delete user"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isFormOpen && (
                <UserForm
                    user={editingUser}
                    onSubmit={handleFormSubmit}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
} 