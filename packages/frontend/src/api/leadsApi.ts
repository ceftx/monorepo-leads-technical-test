import axiosInstance from './axiosInstance';
import { ApiResponse } from 'types/api';
import { Lead, CreateLeadDto, UpdateLeadStatusDto } from 'types/lead';

export const leadsApi = {
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<{ leads: Lead[] }>>('/leads');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return response.data;
  },

  create: async (leadData: CreateLeadDto) => {
    const response = await axiosInstance.post<ApiResponse<{ lead: Lead }>>('/leads', leadData);
    return response.data;
  },

  updateStatus: async (id: number, statusData: UpdateLeadStatusDto) => {
    const response = await axiosInstance.patch<ApiResponse<{ lead: Lead }>>(`/leads/${id}/status`, statusData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/leads/${id}`);
    return response.data;
  }
};
