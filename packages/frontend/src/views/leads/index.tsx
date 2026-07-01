import { useState, useEffect, useMemo } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';

// project imports
import { useLeads } from '../../hooks/useLeads';
import { useSnackbar } from '../../contexts/SnackbarContext';
import LeadStatusChip from '../../components/leads/LeadStatusChip';
import LeadStatusDialog from '../../components/leads/LeadStatusDialog';
import LeadForm from './LeadForm.tsx';
import { Lead, LeadStatus } from '../../types/lead';
import socketService from '../../services/socket.service';
import { useTranslation } from 'i18n';

// assets
import { IconPlus, IconDots, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// ==============================|| LEADS LIST ||============================== //

export default function LeadsList() {
  const { leads, loading, error, updateLeadStatus, deleteLead, refetch } = useLeads();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-refresh cuando llega notificación de lead
  useEffect(() => {
    const handleNotification = (data: any) => {
      const notificationType = data.notification?.type;

      // Si la notificación es sobre un lead, refrescar la lista
      if (notificationType === 'LEAD_CREATED' || notificationType === 'LEAD_STATUS_CHANGED' || notificationType === 'LEAD_DELETED') {
        console.log('📬 Notificación de lead recibida, refrescando lista...');
        refetch();
      }
    };

    // Escuchar notificaciones de WebSocket
    socketService.onNotification(handleNotification);

    // Cleanup
    return () => {
      socketService.offNotification(handleNotification);
    };
  }, [refetch]);

  // Filtrar leads localmente según búsqueda
  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return leads;

    const term = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.nombre.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.empresa.toLowerCase().includes(term) ||
        lead.estado.toLowerCase().includes(term)
    );
  }, [leads, searchTerm]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lead: Lead) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    if (selectedLead) {
      setEditingLead(selectedLead);
      setFormOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedLead) {
      try {
        setDeleteError(null);
        await deleteLead(selectedLead.id);
        setDeleteDialogOpen(false);
        setSelectedLead(null);
        showSnackbar(t('leads.leadDeleted'), 'success');
      } catch (err: any) {
        console.error('Error deleting lead:', err);
        setDeleteError(err?.response?.data?.error?.message || t('messages.serverError'));
      }
    }
  };

  const handleStatusClick = (lead: Lead) => {
    setSelectedLead(lead);
    setStatusDialogOpen(true);
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (selectedLead) {
      try {
        await updateLeadStatus(selectedLead.id, newStatus);
        setStatusDialogOpen(false);
        setSelectedLead(null);
        showSnackbar(t('leads.leadUpdated'), 'success');
      } catch (err: any) {
        console.error('Error updating status:', err);
        showSnackbar(err?.response?.data?.error?.message || t('messages.serverError'), 'error');
        setStatusDialogOpen(false);
      }
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingLead(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetch();
  };

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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2">{t('leads.title')}</Typography>
        <Button variant="contained" startIcon={<IconPlus />} onClick={() => setFormOpen(true)}>
          {t('leads.newLead')}
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <CardContent>
          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('leads.searchLeads')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={20} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('common.name')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('common.email')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('leads.company')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('leads.estimatedAmount')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={t('leads.statusTooltip')} arrow placement="top">
                      <Typography variant="subtitle1" fontWeight={600} sx={{ cursor: 'help' }}>
                        {t('common.status')}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('leads.createdAt')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('common.actions')}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
                        {searchTerm ? t('leads.noLeadsSearch') : t('leads.noLeads')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} hover>
                      <TableCell>
                        <Typography variant="body1">{lead.nombre}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {lead.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{lead.empresa}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600} color="success.main">
                          {formatCurrency(lead.montoEstimado)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            lead.estado === LeadStatus.GANADO || lead.estado === LeadStatus.PERDIDO
                              ? t('leads.statusFinal')
                              : t('leads.statusChange')
                          }
                          arrow
                        >
                          <Box display="inline-block">
                            <LeadStatusChip status={lead.estado} clickable={true} onClick={() => handleStatusClick(lead)} />
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(lead.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, lead)}>
                          <IconDots />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <IconEdit size={18} style={{ marginRight: 8 }} />
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <IconTrash size={18} style={{ marginRight: 8 }} />
          {t('common.delete')}
        </MenuItem>
      </Menu>

      {/* Status Change Dialog */}
      <LeadStatusDialog
        open={statusDialogOpen}
        currentStatus={selectedLead?.estado || LeadStatus.NUEVO}
        leadName={selectedLead?.nombre || ''}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={handleStatusChange}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('leads.deleteLead')}</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>{t('leads.deleteConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lead Form Dialog */}
      <LeadForm open={formOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} lead={editingLead} />
    </Box>
  );
}
