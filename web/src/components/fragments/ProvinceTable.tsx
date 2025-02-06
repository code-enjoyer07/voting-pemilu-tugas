import { useState } from "react";
import { Province } from "@/types";

interface ProvinceTableProps {
    provinces: Province[];
    fetchDelete: (id: number) => void;
    fetchUpdate: (id: number, updatedProvince: Partial<Province>) => void;
}

export default function ProvinceTable({ provinces, fetchDelete, fetchUpdate }: ProvinceTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [formData, setFormData] = useState({ name: "" });

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProvince(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openModal = (province: Province) => {
        setSelectedProvince(province);
        setFormData({ name: province.province });
        setIsModalOpen(true);
    };
    
    const handleSubmit = () => {
        if (selectedProvince && selectedProvince.id) {
            fetchUpdate(selectedProvince.id, { province: formData.name });
            closeModal();
        } else {
            console.error("No province selected or selectedProvince is invalid");
        }
    };
    

    return (
        <div className="overflow-x-auto">
            <h1 className="font-bold text-xl py-5">Table Province</h1>
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {provinces && provinces.length > 0 ? (
                        provinces.map((province) => (
                            <tr key={province.id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">{province.id}</td>
                                <td className="px-4 py-2">{province.province}</td>
                                <td className="flex gap-2 py-2">
                                    <button onClick={() => openModal(province)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                                    <button onClick={() => fetchDelete(province.id)} className="px-2 py-1 bg-gray-500 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-4 py-2 text-center">No provinces available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && selectedProvince && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Province</h2>
                        <label className="block mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded"
                        />
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