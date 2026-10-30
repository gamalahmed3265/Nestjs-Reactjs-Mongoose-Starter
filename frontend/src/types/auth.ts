export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface SignUpPayload {
  email: string;
  name: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

