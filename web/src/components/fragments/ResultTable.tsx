import React, { useEffect, useState } from "react";
import { Fetch } from "@/utils/Fetch";
import { Result } from "@/types";
import { ENV } from "@/env";

export default function ResultTable() {
    const [results, setResults] = useState<Result[]>([]);

    const fetchData = async () => {
        try {
            const response = await Fetch.get('/results', {
                headers: {
                    Authorization: `Bearer ${ENV.TOKEN}`,
                },
            });
            console.log("API Response:", response);
            if (Array.isArray(response.data)) {
                setResults(response.data);
            } else {
                console.error("Expected array but got:", response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="overflow-x-auto">
            <h1 className="font-bold text-xl py-5">Table Result</h1>
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Presiden</th>
                        <th className="px-4 py-2 text-left">Wakil Presiden</th>
                        <th className="px-4 py-2 text-left">City</th>
                        <th className="px-4 py-2 text-left">Province</th>
                        <th className="px-4 py-2 text-left">User</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length > 0 ? (
                        results.map((result) => {
                            return (
                                <tr key={result.id} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-2">{result.id}</td>
                                    <td className="px-4 py-2">{result.presiden}</td>
                                    <td className="px-4 py-2">{result.wakil_presiden}</td>
                                    <td className="px-4 py-2">{result.city?.city || 'No City'}</td>
                                    <td className="px-4 py-2">{result.province?.province || 'No Province'}</td>
                                    <td className="px-4 py-2">{result.users?.username || 'No User'}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4">No results available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
