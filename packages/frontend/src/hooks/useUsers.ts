import { useState, useEffect } from 'react';
import { usersApi } from '../api/usersApi';
import { authApi } from '../api/authApi';
import { User, CreateUserDto } from '../types/user';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createUser: (data: CreateUserDto) => Promise<User | null>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersApi.getAll();

      if (response.success && response.data) {
        setUsers(response.data.users);
      } else {
        setError(response.error?.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err?.response?.data?.error?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: CreateUserDto): Promise<User | null> => {
    try {
      const response = await authApi.register(data);

      if (response.success && response.data) {
        await fetchUsers(); // Refresh list
        return response.data.user;
      } else {
        throw new Error(response.error?.message || 'Failed to create user');
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await usersApi.delete(id);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    deleteUser
  };
};
