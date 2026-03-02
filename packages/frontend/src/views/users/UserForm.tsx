import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// material-ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';

// project imports
import { useUsers } from '../../hooks/useUsers';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { CreateUserDto, UserRole } from '../../types/user';

// Validation schema
const userSchema = z.object({
  nombre: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rol: z.nativeEnum(UserRole)
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ==============================|| USER FORM ||============================== //

export default function UserForm({ open, onClose, onSuccess }: UserFormProps) {
  const { createUser } = useUsers();
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserFormData>({
    // @ts-ignore - Zod version conflict
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      rol: UserRole.VENDEDOR
    }
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({
        nombre: '',
        email: '',
        password: '',
        rol: UserRole.VENDEDOR
      });
      setError(null);
    }
  }, [open, reset]);

  const onSubmit = async (data: UserFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const userData: CreateUserDto = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol
      };

      await createUser(userData);
      showSnackbar('User created successfully', 'success');
      onSuccess();
    } catch (err: any) {
      console.error('Form error:', err);
      setError(err?.response?.data?.error?.message || err.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="rol"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.rol}>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role" disabled={isLoading}>
                    <MenuItem value={UserRole.VENDEDOR}>Vendedor</MenuItem>
                    <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                  </Select>
                  {errors.rol && <FormHelperText>{errors.rol.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
