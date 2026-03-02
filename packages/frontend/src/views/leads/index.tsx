import { useState } from 'react';

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
  Tooltip
} from '@mui/material';

// project imports
import { useLeads } from '../../hooks/useLeads';
import { useSnackbar } from '../../contexts/SnackbarContext';
import LeadStatusChip from '../../components/leads/LeadStatusChip';
import LeadStatusDialog from '../../components/leads/LeadStatusDialog';
import LeadForm from './LeadForm.tsx';
import { Lead, LeadStatus } from '../../types/lead';

// assets
import { IconPlus, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
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

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
        showSnackbar('Lead deleted successfully', 'success');
      } catch (err: any) {
        console.error('Error deleting lead:', err);
        setDeleteError(err?.response?.data?.error?.message || 'Failed to delete lead. Please try again.');
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
        showSnackbar('Lead status updated successfully', 'success');
      } catch (err: any) {
        console.error('Error updating status:', err);
        showSnackbar(err?.response?.data?.error?.message || 'Failed to update status', 'error');
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
        <Typography variant="h2">Leads</Typography>
        <Button variant="contained" startIcon={<IconPlus />} onClick={() => setFormOpen(true)}>
          New Lead
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Company
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" fontWeight={600}>
                      Estimated Amount
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Click on status to change it" arrow placement="top">
                      <Typography variant="subtitle1" fontWeight={600} sx={{ cursor: 'help' }}>
                        Status
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Created
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" fontWeight={600}>
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
                        No leads found. Create your first lead!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
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
                              ? 'Final status - cannot be changed'
                              : 'Click to change status'
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
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <IconTrash size={18} style={{ marginRight: 8 }} />
          Delete
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
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete the lead <strong>{selectedLead?.nombre}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lead Form Dialog */}
      <LeadForm open={formOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} lead={editingLead} />
    </Box>
  );
}
