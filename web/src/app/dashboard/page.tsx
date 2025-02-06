"use client";
import Sidebar from "@/components/fragments/Sidebar";
import { ENV } from "@/env";
import { AuthProvider } from "@/middleware/auth";
import { City, Province, User } from "@/types";
import { Fetch } from "@/utils/Fetch";
import React, { useEffect, useState } from "react";
import UserTable from "@/components/fragments/UserTable";
import ProvinceTable from "@/components/fragments/ProvinceTable";
import CityTable from "@/components/fragments/CityTable";
import { useRouter } from "next/navigation";
import ResultTable from "@/components/fragments/ResultTable";

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);
  const [provinces, setProvinces] = useState<{ id: number, province: string }[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [provinceId, setProvinceId] = useState<number>(0);

    const router = useRouter()

    const fetchUser = async () => {
        try {
            const response = await Fetch.get("/users", {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const fetchUnbanned = async (id: number) => {
        try {
            await Fetch.put(`/users/ban/${id}`, { status: "active" }, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` }
            });
            fetchUser();
        } catch (error) {
            console.error("Error unbanning user:", error);
        }
    };

    const fetchBan = async (id: number) => {
        try {
            await Fetch.put(`/users/ban/${id}`, { status: "banned" }, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` }
            });
            fetchUser();
        } catch (error) {
            console.error("Error banning user:", error);
        }
    };

    const fetchDelete = async (id: number) => {
        try {
            await Fetch.delete(`/users/${id}`, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` }
            });
            await fetchUser();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const fetchUpdate = async (id: number, data: Partial<User>) => {
        try {
            await Fetch.put(`/users/${id}`, data, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });

            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === id ? { ...user, ...data } : user))
            );
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await Fetch.get("/province", {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            setProvinces([]);
        }
    };

    const fetchProvinceDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/provinces/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setProvinces((prevProvinces) =>
                    prevProvinces.filter((province) => province.id !== id)
                );
            } else {
                console.error("Failed to delete province");
            }
        } catch (error) {
            console.error("Error deleting province:", error);
        }
    };

    const fetchProvinceUpdate = async (id: number, data: Partial<Province>) => {
        try {
            await Fetch.put(`/province/${id}`, data, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });

            setProvinces((prevProvinces) =>
                prevProvinces.map((province) => (province.id === id ? { ...province, ...data } : province))
            );
        } catch (error) {
            console.error("Error updating province:", error);
        }
    };

    const fetchProvinceCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await Fetch.post('/province', { province: province }, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });
            console.log(response)
            fetchProvinces()
        } catch (error) {
            console.error("Error creating province:", error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await Fetch.get("/city", {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });

            if (Array.isArray(response.data)) {
                setCities(response.data);
            } else {
                console.error("Expected an array, but received:", response.data);
                setCities([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setCities([]);
        }
    };

    const fetchCityDelete = async (id: number) => {
        try {
            await Fetch.delete(`/city/${id}`, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });
            await fetchCities();
        } catch (error) {
            console.error("Error deleting city:", error);
        }
    };

    const fetchCityUpdate = async (id: number, data: Partial<City>) => {
        try {
            await Fetch.put(`/city/${id}`, data, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });
            await fetchCities();
        } catch (error) {
            console.error("Error updating city:", error);
        }
    };

    const fetchCityCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await Fetch.post('/city', {
                city,
                province_id: provinceId
            }, {
                headers: { Authorization: `Bearer ${ENV.TOKEN}` },
            });
            fetchCities();
            setCity('');
            setProvinceId(0);
        } catch (error) {
            console.error("Error creating city:", error);
        }
    };

    useEffect(() => {
        if (ENV.ROLE !== 'administrator') {
            router.push('/dashboard/user')
        }
        fetchUser();
        fetchProvinces();
        fetchCities();
    }, []);

    return (
        <AuthProvider>
            <Sidebar>
                <h1 className="font-bold text-xl py-5">Users table</h1>
                <UserTable users={users} fetchBan={fetchBan} fetchUnbanned={fetchUnbanned} fetchDelete={fetchDelete} fetchUpdate={fetchUpdate} />
                <ProvinceTable provinces={provinces} fetchDelete={fetchProvinceDelete} fetchUpdate={fetchProvinceUpdate} />

                <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Create New Province</h2>
                    <form onSubmit={fetchProvinceCreate} className="space-y-4">
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                                Province Name
                            </label>
                            <input
                                type="text"
                                id="province"
                                placeholder="Enter province name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Create Province
                        </button>
                    </form>
                </div>
                <CityTable
                    cities={cities}
                    fetchDelete={fetchCityDelete}
                    fetchUpdate={fetchCityUpdate}
                />
                <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Create New City</h2>
                    <form onSubmit={fetchCityCreate} className="space-y-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                Province Name
                            </label>
                            <input
                                type="text"
                                id="city"
                                placeholder="Enter province name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <label className="block text-sm font-medium text-gray-700">Province</label>
                        <select
                            name="province_id"
                            value={provinceId}
                            onChange={(e) => setProvinceId(Number(e.target.value))}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option>Select Province</option>
                            {provinces.length > 0 ? (
                                provinces.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.province}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No provinces available</option>
                            )}
                        </select>

                        <button
                            type="submit"
                            className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Create Province
                        </button>
                    </form>
                </div>
                <ResultTable />
            </Sidebar>
        </AuthProvider>
    );
}