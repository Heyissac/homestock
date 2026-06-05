const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, requiresAuth = false } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        // El backend devuelve { error: "mensaje" } en los casos de error
        throw new Error(data.error ?? 'Something went wrong');
    }

    return data as T;
}

export const apiClient = {
    get: <T>(endpoint: string, requiresAuth = false) =>
        request<T>(endpoint, { method: 'GET', requiresAuth }),

    post: <T>(endpoint: string, body: unknown, requiresAuth = false) =>
        request<T>(endpoint, { method: 'POST', body, requiresAuth }),

    put: <T>(endpoint: string, body: unknown, requiresAuth = false) =>
        request<T>(endpoint, { method: 'PUT', body, requiresAuth }),

    patch: <T>(endpoint: string, body: unknown, requiresAuth = false) =>
        request<T>(endpoint, { method: 'PATCH', body, requiresAuth }),

    delete: <T>(endpoint: string, requiresAuth = false) =>
        request<T>(endpoint, { method: 'DELETE', requiresAuth }),
};