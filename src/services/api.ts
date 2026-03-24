import axios from 'axios';
import type { TripFormData, TripResult, SavedTrip, AuthResponse, TripListItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

interface CalculationResponse extends TripResult {
    trip_id: number;
}

export interface PaginatedTrips {
    trips: TripListItem[];
    total_count: number;
    total_pages: number;
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
}

export const calculateTrip = async (tripData: TripFormData): Promise<CalculationResponse> => {
    try {
        const response = await api.post<CalculationResponse>('/calculate-trip/', tripData);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.data) {
                throw error.response.data;
            }
            throw { error: error.message };
        }
        throw { error: String(error) };
    }
};

export const listTrips = async (params: { q?: string; page?: number; page_size?: number } = {}): Promise<PaginatedTrips> => {
    try {
        const response = await api.get('/trips/', { params });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch trips:', error);
        throw error;
    }
};

export const getTripDetail = async (id: string | number): Promise<SavedTrip> => {
    try {
        const response = await api.get(`/trips/${id}/`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch trip ${id}:`, error);
        throw error;
    }
};

export const deleteTrip = async (id: number | string): Promise<void> => {
    try {
        await api.delete(`/trips/${id}/delete/`);
    } catch (error) {
        console.error('Failed to delete trip:', error);
        throw error;
    }
};

export const signupUser = async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/account/signup/', data);
    return response.data;
};

export const loginUser = async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/account/login/', data);
    return response.data;
};

export default api;
