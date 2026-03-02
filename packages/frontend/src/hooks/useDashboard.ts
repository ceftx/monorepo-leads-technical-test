import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { UserMetrics, GlobalMetrics } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

interface UseDashboardResult {
  metrics: UserMetrics | GlobalMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardResult => {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState<UserMetrics | GlobalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Admin obtiene métricas globales, vendedor obtiene sus propias métricas
      const response = isAdmin ? await dashboardApi.getGlobalMetrics() : await dashboardApi.getUserMetrics();

      if (response.success && response.data) {
        setMetrics(response.data.metrics);
      } else {
        setError(response.error?.message || 'Failed to fetch metrics');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard metrics:', err);
      setError(err?.response?.data?.error?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};
