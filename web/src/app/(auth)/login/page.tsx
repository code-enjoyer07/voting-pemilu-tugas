"use client"
import { Fetch } from "@/utils/Fetch"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function Page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const r = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await Fetch.post('/auth/login', {
                email,
                password
            })
            console.log(response.data)
            if (response.status == 200) {
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('role', response.data.user.role)
                r.push('/dashboard')
            }
        } catch (error: any) {
            setMessage(error.response.data.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Login an Account</h1>
                <p className="text-red-500">{message}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-lg font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-lg font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Dont have account?{" "}
                    <a href="/register" className="text-indigo-600 hover:text-indigo-700">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    )
}
