import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import { useAuth } from 'contexts/AuthContext';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    // @ts-ignore - Zod version conflict between v3 and v4
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.response?.data?.error?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <CustomFormControl fullWidth error={!!errors.email}>
            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
            <OutlinedInput {...field} id="outlined-adornment-email-login" type="email" placeholder="admin@leads.com" disabled={isLoading} />
            {errors.email && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.email.message}</Box>}
          </CustomFormControl>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <CustomFormControl fullWidth error={!!errors.password}>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              {...field}
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {errors.password && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.password.message}</Box>}
          </CustomFormControl>
        )}
      />

      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} color="primary" disabled={isLoading} />}
            label="Keep me logged in"
          />
        )}
      />

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
