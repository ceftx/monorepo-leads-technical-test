import { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

// project imports
import { useDashboard } from '../../../hooks/useDashboard';
import { useAuth } from '../../../contexts/AuthContext';
import { LeadStatus } from '../../../types/lead';
import { GlobalMetrics } from '../../../types/api';

// assets
import { IconFileDescription, IconCurrencyDollar, IconTrendingUp, IconChartPie, IconTrophy } from '@tabler/icons-react';

// Helper function to get status color
const getStatusColor = (status: LeadStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
  switch (status) {
    case LeadStatus.NUEVO:
      return 'primary';
    case LeadStatus.CONTACTADO:
      return 'warning';
    case LeadStatus.GANADO:
      return 'success';
    case LeadStatus.PERDIDO:
      return 'error';
    default:
      return 'default';
  }
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount);
};

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const theme = useTheme();
  const { user, isAdmin } = useAuth();
  const { metrics, loading, error, refetch } = useDashboard();

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No metrics available</Alert>
      </Box>
    );
  }

  const globalMetrics = metrics as GlobalMetrics;
  const isGlobalMetrics = 'totalUsuarios' in metrics;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          {isAdmin ? 'Global Dashboard' : 'My Dashboard'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Welcome back, {user?.nombre}!
        </Typography>
      </Box>

      {/* Metric Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
        {/* Total Leads */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Total Leads
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                  {metrics.totalLeads}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  bgcolor: `${theme.palette.primary.main}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconFileDescription size={28} color={theme.palette.primary.main} />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Total Estimated Amount */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Total Amount
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                  {formatCurrency(metrics.montoEstimadoTotal)}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  bgcolor: `${theme.palette.success.main}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconCurrencyDollar size={28} color={theme.palette.success.main} />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Leads Last 7 Days */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Last 7 Days
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                  {metrics.leadsUltimos7Dias}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  bgcolor: `${theme.palette.warning.main}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconTrendingUp size={28} color={theme.palette.warning.main} />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Total Users (Admin only) */}
        {isGlobalMetrics && (
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total Users
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                    {globalMetrics.totalUsuarios}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    bgcolor: `${theme.palette.secondary.main}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconTrophy size={28} color={theme.palette.secondary.main} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Distribution by Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <IconChartPie size={24} color={theme.palette.primary.main} />
            <Typography variant="h4">Distribution by Status</Typography>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {metrics.distribucionPorEstado.map((item, index) => (
              <Chip
                key={index}
                label={`${item.estado}: ${item.cantidad}`}
                color={getStatusColor(item.estado)}
                sx={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Vendor Ranking (Admin only) */}
      {isGlobalMetrics && globalMetrics.rankingVendedores && globalMetrics.rankingVendedores.length > 0 && (
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <IconTrophy size={24} color={theme.palette.primary.main} />
              <Typography variant="h4">Top Vendors by Revenue</Typography>
            </Stack>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Rank
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Vendor
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" fontWeight={600}>
                        Won Leads
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" fontWeight={600}>
                        Revenue
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {globalMetrics.rankingVendedores.map((vendor, index) => (
                    <TableRow key={vendor.userId} hover>
                      <TableCell>
                        <Chip label={`#${index + 1}`} size="small" color={index === 0 ? 'primary' : 'default'} sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{vendor.nombreVendedor}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1">{vendor.leadsGanados}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600} color="success.main">
                          {formatCurrency(vendor.montoGanado)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
