import { useState } from 'react';
import { register, login, logout } from '../services/auth.service';
import type { RegisterInput, LoginInput, AuthUser } from '../types/auth.types';

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: false,
        error: null,
    });

    async function handleRegister(input: RegisterInput): Promise<boolean> {
        setState({ user: null, loading: true, error: null });

        try {
            const response = await register(input);
            setState({ user: response.user, loading: false, error: null });
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setState({ user: null, loading: false, error: message });
            return false;
        }
    }

    async function handleLogin(input: LoginInput): Promise<boolean> {
        setState({ user: null, loading: true, error: null });

        try {
            const response = await login(input);
            setState({ user: response.user, loading: false, error: null });
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setState({ user: null, loading: false, error: message });
            return false;
        }
    }

    function handleLogout(): void {
        logout();
        setState({ user: null, loading: false, error: null });
    }

    return {
        user: state.user,
        loading: state.loading,
        error: state.error,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
    };
}