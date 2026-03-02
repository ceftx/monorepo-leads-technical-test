import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { authApi } from 'api/authApi';
import { useTranslation } from 'i18n';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ==============================|| REGISTER - SCHEMA ||============================== //

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  terms: z.boolean().refine((val) => val === true, 'Debes aceptar los términos y condiciones')
});

type RegisterFormData = z.infer<typeof registerSchema>;

// ==============================|| JWT - REGISTER ||=============================== //

export default function AuthRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState<{ label: string; color: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    // @ts-ignore - Zod version conflict between v3 and v4
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      terms: false
    }
  });

  const passwordValue = watch('password');

  useEffect(() => {
    if (passwordValue) {
      const temp = strengthIndicator(passwordValue);
      setStrength(temp);
      setLevel(strengthColor(temp));
    } else {
      setStrength(0);
      setLevel(null);
    }
  }, [passwordValue]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('📝 Intentando registrar usuario:', data.email);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // Combine firstName and lastName into nombre as the API expects
      await authApi.register({
        email: data.email,
        password: data.password,
        nombre: `${data.firstName} ${data.lastName}`
      });

      console.log('✅ Registro exitoso');
      setSuccessMessage(t('auth.registerSuccess'));

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      const error = err?.response?.data?.error?.message || t('auth.registerError');
      setErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <Stack sx={{ mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1">{t('auth.registerTitle')}</Typography>
      </Stack>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <CustomFormControl fullWidth error={!!errors.firstName}>
                  <InputLabel htmlFor="outlined-adornment-first-register">{t('auth.firstName')}</InputLabel>
                  <OutlinedInput {...field} id="outlined-adornment-first-register" type="text" disabled={isLoading} />
                  {errors.firstName && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.firstName.message}</Box>}
                </CustomFormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <CustomFormControl fullWidth error={!!errors.lastName}>
                  <InputLabel htmlFor="outlined-adornment-last-register">{t('auth.lastName')}</InputLabel>
                  <OutlinedInput {...field} id="outlined-adornment-last-register" type="text" disabled={isLoading} />
                  {errors.lastName && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.lastName.message}</Box>}
                </CustomFormControl>
              )}
            />
          </Grid>
        </Grid>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomFormControl fullWidth error={!!errors.email} sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-email-register">{t('auth.email')}</InputLabel>
              <OutlinedInput {...field} id="outlined-adornment-email-register" type="email" disabled={isLoading} />
              {errors.email && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.email.message}</Box>}
            </CustomFormControl>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomFormControl fullWidth error={!!errors.password} sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-password-register">{t('auth.password')}</InputLabel>
              <OutlinedInput
                {...field}
                id="outlined-adornment-password-register"
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
                label={t('auth.password')}
              />
              {errors.password && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.password.message}</Box>}
            </CustomFormControl>
          )}
        />

        {strength !== 0 && level && (
          <FormControl fullWidth>
            <Box sx={{ mb: 2, mt: 1 }}>
              <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level.color }} />
                <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                  {level.label}
                </Typography>
              </Stack>
            </Box>
          </FormControl>
        )}

        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  disabled={isLoading}
                  color="primary"
                />
              }
              label={<Typography variant="subtitle1">{t('auth.terms')}</Typography>}
            />
          )}
        />
        {errors.terms && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: -1, mb: 1 }}>{errors.terms.message}</Box>}

        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : t('auth.signUp')}
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
}
