export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface UserLoginResponse {
  token: string;
  iat?: number;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  success: boolean;
  error?: string;
}
