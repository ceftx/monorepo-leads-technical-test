import axiosInstance from './axiosInstance';
import { ApiResponse, UserMetrics, GlobalMetrics } from 'types/api';

export const dashboardApi = {
  getUserMetrics: async () => {
    const response = await axiosInstance.get<ApiResponse<{ metrics: UserMetrics }>>('/dashboard/user');
    return response.data;
  },

  getUserMetricsById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<{ metrics: UserMetrics }>>(`/dashboard/user/${id}`);
    return response.data;
  },

  getGlobalMetrics: async () => {
    const response = await axiosInstance.get<ApiResponse<{ metrics: GlobalMetrics }>>('/dashboard/global');
    return response.data;
  }
};
