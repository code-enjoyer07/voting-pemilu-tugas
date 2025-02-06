"use client"
import { ENV } from "@/env";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = ENV.TOKEN
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push("/login");
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
