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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    console.log('🔐 Intentando login con:', data.email);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      console.log('✅ Login exitoso, navegando a dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      const error = err?.response?.data?.error?.message || 'Invalid email or password';
      console.log('📢 Mostrando error:', error);
      setErrorMessage(error);
      console.log('📢 ErrorMessage seteado, esperando render...');

      // Forzar que React renderice antes de cualquier otra cosa
      setTimeout(() => {
        console.log('✅ Error debería estar visible ahora');
      }, 100);
    } finally {
      setIsLoading(false);
      console.log('🏁 Finally ejecutado, isLoading=false');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {errorMessage && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Box sx={{ color: 'error.dark', fontWeight: 500 }}>{errorMessage}</Box>
        </Box>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <CustomFormControl fullWidth error={!!errors.email}>
            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
            <OutlinedInput
              {...field}
              id="outlined-adornment-email-login"
              type="email"
              placeholder="admin@leads.com (default)"
              disabled={isLoading}
            />
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
                    type="button"
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
