import { useState, useEffect } from 'react';
import { leadsApi } from '../api/leadsApi';
import { Lead, CreateLeadDto, LeadStatus } from '../types/lead';

interface UseLeadsResult {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createLead: (data: CreateLeadDto) => Promise<Lead | null>;
  updateLeadStatus: (id: number, status: LeadStatus) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
}

export const useLeads = (): UseLeadsResult => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await leadsApi.getAll();

      if (response.success && response.data) {
        setLeads(response.data.leads);
      } else {
        setError(response.error?.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err?.response?.data?.error?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (data: CreateLeadDto): Promise<Lead | null> => {
    try {
      const response = await leadsApi.create(data);

      if (response.success && response.data) {
        await fetchLeads(); // Refresh list
        return response.data.lead;
      } else {
        throw new Error(response.error?.message || 'Failed to create lead');
      }
    } catch (err: any) {
      console.error('Error creating lead:', err);
      throw err;
    }
  };

  const updateLeadStatus = async (id: number, status: LeadStatus): Promise<void> => {
    try {
      await leadsApi.updateStatus(id, { estado: status });
      await fetchLeads(); // Refresh list
    } catch (err: any) {
      console.error('Error updating lead status:', err);
      throw err;
    }
  };

  const deleteLead = async (id: number): Promise<void> => {
    try {
      await leadsApi.delete(id);
      // El backend devuelve 204 No Content, así que no hay response.data
      await fetchLeads(); // Refresh list
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    createLead,
    updateLeadStatus,
    deleteLead
  };
};
