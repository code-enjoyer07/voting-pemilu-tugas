"use client"
import Sidebar from "@/components/fragments/Sidebar";
import { ENV } from "@/env";
import { AuthProvider } from "@/middleware/auth";
import { Result } from "@/types";
import { Fetch } from "@/utils/Fetch";
import { useState, useEffect } from "react";

export default function page() {
    const [pSatu, setPSatu] = useState<Result[]>([]);
    const [pDua, setPDua] = useState<Result[]>([]);
    const [pTiga, setPTiga] = useState<Result[]>([]);

    const paslonSatu = async () => {
        const response = await Fetch.get('/results/01', {
            headers: {
                Authorization: `Bearer ${ENV.TOKEN}`
            }
        });
        setPSatu(response.data);
    };

    const paslonDua = async () => {
        const response = await Fetch.get('/results/02', {
            headers: {
                Authorization: `Bearer ${ENV.TOKEN}`
            }
        });
        setPDua(response.data);
    };

    const paslonTiga = async () => {
        const response = await Fetch.get('/results/03', {
            headers: {
                Authorization: `Bearer ${ENV.TOKEN}`
            }
        });
        setPTiga(response.data);
    };

    useEffect(() => {
        paslonSatu();
        paslonDua();
        paslonTiga();

        const interval = setInterval(() => {
            paslonSatu();
            paslonDua();
            paslonTiga();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const countVotes = (results: Result[], number: string) => {
        return results.filter((item) => item.number === number).length;
    };

    return (
        <AuthProvider>
            <Sidebar>
                <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg cursor-pointer">
                        <img src="/1.jpeg" alt="Anies Baswedan" className="w-[200px] object-cover border-2 border-gray-300" />
                        <p>Anies Baswedan</p>
                        <p>Votes: {countVotes(pSatu, "01")}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg cursor-pointer">
                        <img src="/2.jpeg" alt="Prabowo Subianto" className="w-[200px] object-cover border-2 border-gray-300" />
                        <p>Prabowo Subianto</p>
                        <p>Votes: {countVotes(pDua, "02")}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg cursor-pointer">
                        <img src="/3.jpeg" alt="Ganjar Pranowo" className="w-[200px] object-cover border-2 border-gray-300" />
                        <p>Ganjar Pranowo</p>
                        <p>Votes: {countVotes(pTiga, "03")}</p>
                    </div>
                </div>
            </Sidebar>
        </AuthProvider>
    );
}
