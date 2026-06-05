// Lo que el formulario de registro envía al backend
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// Lo que el formulario de login envía al backend
export interface LoginInput {
  email: string;
  password: string;
}

// El objeto usuario que devuelven ambos endpoints
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// Respuesta completa de POST /api/auth/register → { user }
export interface RegisterResponse {
  user: AuthUser;
}

// Respuesta completa de POST /api/auth/login → { token, user }
export interface LoginResponse {
  token: string;
  user: AuthUser;
}