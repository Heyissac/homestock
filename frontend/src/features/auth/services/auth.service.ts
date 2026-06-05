import { apiClient } from '../../../lib/api';
import type { RegisterInput, LoginInput, RegisterResponse, LoginResponse } from '../types/auth.types';

export async function register(input: RegisterInput): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/api/auth/register', input);
}

export async function login(input: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', input);

    // Guardamos el token en localStorage para que el cliente HTTP
    // lo adjunte automáticamente en requests protegidos futuros
    localStorage.setItem('token', response.token);

    return response;
}

export function logout(): void {
    localStorage.removeItem('token');
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
    return getToken() !== null;
}