"use client";
import { useState, useEffect } from "react";
import { City, Province } from "@/types";
import { Fetch } from "@/utils/Fetch";
import { ENV } from "@/env";

interface CityTableProps {
    cities: City[];
    fetchDelete: (id: number) => void;
    fetchUpdate: (id: number, updatedCity: Partial<City>) => void;
}

export default function CityTable({ cities, fetchDelete, fetchUpdate }: CityTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [formData, setFormData] = useState({ city: "", province_id: "" });
    const [provinces, setProvinces] = useState<Province[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await Fetch.get("/province", {
                    headers: { Authorization: `Bearer ${ENV.TOKEN}` },
                });
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
    }, []);

    const openModal = (city: City) => {
        setSelectedCity(city);
        setFormData({ city: city.city, province_id: city.province_id.toString() });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCity(null);
        setFormData({ city: "", province_id: "" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (selectedCity) {
            const updatedData = {
                city: formData.city,
                province_id: parseInt(formData.province_id),
            };
            fetchUpdate(selectedCity.id, updatedData);
            closeModal();
        }
    };

    // Fungsi untuk mendapatkan nama provinsi berdasarkan ID
    const getProvinceName = (provinceId: number) => {
        const province = provinces.find((p) => p.id === provinceId);
        return province ? province.province : "N/A";
    };

    return (
        <div className="overflow-x-auto">
            <h1 className="font-bold text-xl py-5">Table City</h1>
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">City</th>
                        <th className="px-4 py-2 text-left">Province</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-2 text-center">
                                No City Available
                            </td>
                        </tr>
                    ) : (
                        cities.map((city) => (
                            <tr key={city.id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">{city.id}</td>
                                <td className="px-4 py-2">{city.city}</td>
                                <td className="px-4 py-2">{getProvinceName(city.province_id)}</td>
                                <td className="flex gap-2 py-2">
                                    <button
                                        onClick={() => openModal(city)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => fetchDelete(city.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>

            {isModalOpen && selectedCity && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit City</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City Name</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Province</label>
                                <select
                                    name="province_id"
                                    value={formData.province_id}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.province}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={closeModal}
                                className="px-3 py-2 bg-gray-500 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-3 py-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}