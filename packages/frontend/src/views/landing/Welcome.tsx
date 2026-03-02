import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Stack, Typography, Card, CardContent, useMediaQuery, Grid, Chip } from '@mui/material';

// project imports
import { useAuth } from 'contexts/AuthContext';

// assets
import { IconChartBar, IconUsers, IconShieldCheck, IconTrendingUp, IconArrowRight } from '@tabler/icons-react';
import Logo from 'ui-component/Logo';

// third-party
import { motion } from 'framer-motion';

// ================================|| LANDING - WELCOME ||================================ //

export default function Welcome() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <IconChartBar size={32} stroke={1.5} />,
      title: 'Dashboard Analytics',
      description: 'Métricas en tiempo real y análisis profundo del rendimiento de tus leads',
      color: '#2196F3'
    },
    {
      icon: <IconUsers size={32} stroke={1.5} />,
      title: 'Gestión de Leads',
      description: 'CRM integral para rastrear y gestionar todos tus leads de ventas',
      color: '#673AB7'
    },
    {
      icon: <IconShieldCheck size={32} stroke={1.5} />,
      title: 'Acceso Seguro',
      description: 'Autenticación segura con roles de administrador y vendedor',
      color: '#4CAF50'
    },
    {
      icon: <IconTrendingUp size={32} stroke={1.5} />,
      title: 'Seguimiento de Ventas',
      description: 'Monitorea ingresos, tasas de conversión y rendimiento',
      color: '#FF9800'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(33, 150, 243, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(103, 58, 183, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, transparent 70%)`,
          filter: 'blur(60px)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
          filter: 'blur(60px)'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
            onClick={() => navigate('/')}
          >
            <Logo />
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label="Professional CRM"
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 500,
                display: { xs: 'none', sm: 'flex' }
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Iniciar Sesión
            </Button>
          </Stack>
        </Box>

        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            textAlign: 'center',
            maxWidth: 900,
            mx: 'auto'
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip
              label="🚀 Transforma tu gestión de ventas"
              sx={{
                mb: 3,
                bgcolor: 'primary.light',
                color: 'primary.dark',
                fontWeight: 500,
                py: 2.5,
                px: 1,
                fontSize: '0.95rem'
              }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Typography
              variant={matchDownSM ? 'h2' : 'h1'}
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                lineHeight: 1.2
              }}
            >
              Leads Ceftx
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Typography
              variant={matchDownSM ? 'h5' : 'h4'}
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                mb: 3
              }}
            >
              Tu sistema integral de gestión de leads
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                mb: 5,
                fontSize: '1.1rem',
                lineHeight: 1.8
              }}
            >
              Optimiza tu proceso de ventas, gestiona leads eficientemente y potencia la productividad de tu equipo con nuestra plataforma
              integral de gestión.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<IconArrowRight />}
                onClick={() => navigate('/login')}
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                  '&:hover': {
                    boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Comenzar Ahora
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light',
                    color: 'primary.dark'
                  }
                }}
              >
                Ver Demo
              </Button>
            </Stack>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                mb: 2,
                color: 'text.primary'
              }}
            >
              Todo lo que necesitas para gestionar tus ventas
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 6,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              Herramientas poderosas diseñadas para impulsar el crecimiento de tu negocio
            </Typography>
          </motion.div>

          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${feature.color}20`,
                        borderColor: feature.color
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${feature.color}15`,
                            color: feature.color
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {feature.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.05)'
                }}
              />
              <CardContent sx={{ p: 5, position: 'relative' }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2} sx={{ mb: { xs: 3, md: 0 } }}>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                        Potencia tu equipo de ventas
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem' }}>
                        Únete a cientos de empresas que ya están transformando su gestión de leads con Leads Ceftx.
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                          mt: 2,
                          bgcolor: 'white',
                          color: 'primary.main',
                          fontWeight: 600,
                          alignSelf: 'flex-start',
                          '&:hover': {
                            bgcolor: 'grey.100'
                          }
                        }}
                      >
                        Empezar Gratis
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={3}>
                      {[
                        { value: '500+', label: 'Empresas' },
                        { value: '10K+', label: 'Leads Gestionados' },
                        { value: '99.9%', label: 'Uptime' },
                        { value: '24/7', label: 'Soporte' }
                      ].map((stat, idx) => (
                        <Grid size={6} key={idx}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                              {stat.value}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {stat.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              ¿Listo para empezar?
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Comienza hoy mismo y transforma tu gestión de ventas
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<IconArrowRight />}
              onClick={() => navigate('/login')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              Iniciar Sesión
            </Button>
          </motion.div>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 4,
            borderTop: '1px solid',
            borderColor: 'grey.200',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © 2024 Leads Ceftx. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Términos
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Privacidad
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Contacto
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
