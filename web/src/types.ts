export interface User {
    id: number;
    username: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Province {
    id: number;
    province: string;
}

export interface City {
    id: number;
    city: string;
    province_id: number;
    province: Province;
}

export interface Result {
    id: number;
    number: string;
    presiden: string;
    wakil_presiden: string;
    province_id: number;
    city_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    province: Province;
    city: City;
    users: User;
}
