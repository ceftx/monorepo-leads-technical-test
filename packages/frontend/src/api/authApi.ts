import axiosInstance from './axiosInstance';
import { ApiResponse, LoginRequest, LoginResponse } from 'types/api';
import { CreateUserDto, User } from 'types/user';

export const authApi = {
  login: async (credentials: LoginRequest) => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: CreateUserDto) => {
    const response = await axiosInstance.post<ApiResponse<{ user: User }>>('/auth/register', userData);
    return response.data;
  },

  refreshToken: async (token: string) => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/refresh', { token });
    return response.data;
  }
};
