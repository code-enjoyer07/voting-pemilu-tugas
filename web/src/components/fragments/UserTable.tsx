import { useState } from "react";
import { User } from "@/types";

interface UserTableProps {
    users: User[];
    fetchBan: (id: number) => void;
    fetchUnbanned: (id: number) => void;
    fetchDelete: (id: number) => void;
    fetchUpdate: (id: number, updatedUser: Partial<User>) => void;
}

export default function UserTable({ users, fetchBan, fetchUnbanned, fetchDelete, fetchUpdate }: UserTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ username: "", email: "", role: "" });

    const openModal = (user: User) => {
        setSelectedUser(user);
        setFormData({ username: user.username, email: user.email, role: user.role });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (selectedUser) {
            fetchUpdate(selectedUser.id, formData);
            closeModal();
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Username</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Create at</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2">{user.id}</td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.role}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-4 py-2">{user.created_at}</td>
                            <td className="flex gap-2 py-2">
                                <button onClick={() => fetchBan(user.id)} className="px-2 py-1 bg-red-500 text-white rounded">Ban</button>
                                <button onClick={() => fetchUnbanned(user.id)} className="px-2 py-1 bg-green-500 text-white rounded">Unban</button>
                                <button onClick={() => openModal(user)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                                <button onClick={() => fetchDelete(user.id)} className="px-2 py-1 bg-gray-500 text-white rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                        <label className="block mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                        <label className="block mt-2 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                        <label className="block mt-2 mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={closeModal} className="px-3 py-2 bg-gray-500 text-white rounded">Cancel</button>
                            <button onClick={handleSubmit} className="px-3 py-2 bg-blue-500 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
