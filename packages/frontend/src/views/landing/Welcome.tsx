import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Stack, Typography, Card, CardContent, useMediaQuery } from '@mui/material';

// project imports
import { useAuth } from 'contexts/AuthContext';

// assets
import { IconChartBar, IconUsers, IconShieldCheck, IconTrendingUp } from '@tabler/icons-react';

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
      icon: <IconChartBar size={40} stroke={1.5} />,
      title: 'Dashboard Analytics',
      description: 'Real-time metrics and insights about your leads performance'
    },
    {
      icon: <IconUsers size={40} stroke={1.5} />,
      title: 'Lead Management',
      description: 'Comprehensive CRM to track and manage all your sales leads'
    },
    {
      icon: <IconShieldCheck size={40} stroke={1.5} />,
      title: 'Role-Based Access',
      description: 'Secure authentication with admin and sales representative roles'
    },
    {
      icon: <IconTrendingUp size={40} stroke={1.5} />,
      title: 'Sales Tracking',
      description: 'Monitor revenue, conversion rates, and vendor performance'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Hero Section */}
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography
              variant={matchDownSM ? 'h2' : 'h1'}
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Leads Management System
            </Typography>
            <Typography
              variant={matchDownSM ? 'h4' : 'h3'}
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
                maxWidth: 600
              }}
            >
              Professional CRM solution for sales teams
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 700,
                fontSize: '1.1rem'
              }}
            >
              Streamline your sales process, track leads efficiently, and boost your team's productivity with our comprehensive lead
              management platform.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>

          {/* Features Section */}
          <Box sx={{ mt: 6 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
                    minWidth: { xs: 'auto', sm: '250px' }
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[12]
                      }
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2} alignItems="center" textAlign="center">
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: `${theme.palette.primary.light}20`
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.dark }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {feature.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Stats Section */}
          <Box sx={{ mt: 4 }}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        100%
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Type Safe
                      </Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        Secure
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        JWT Authentication
                      </Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        Fast
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Real-time Updates
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Footer CTA */}
          <Box sx={{ mt: 4 }}>
            <Stack alignItems="center" spacing={2}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 500 }}>
                Ready to get started?
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Access Your Account
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
