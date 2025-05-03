export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export interface SignupResponse {
  user: UserResponse;
}

export interface SigninResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthUser {
  userId: string;
}