export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  refreshInProgress: boolean;
  error: string | null;
}

// Type definitions for cookie options
export type CookieAttributes = {
  expires: number;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  httpOnly?: boolean; // Note: js-cookie can't set httpOnly (server-side only)
};