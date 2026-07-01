import axiosInstance from './axiosInstance';
import { ApiResponse } from 'types/api';
import { User } from 'types/user';

export const usersApi = {
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<{ users: User[] }>>('/users');
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }
};
