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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

// project imports
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import UserRoleChip from '../../components/users/UserRoleChip';
import UserForm from './UserForm';
import { User } from '../../types/user';
import { useTranslation } from 'i18n';

// assets
import { IconPlus, IconTrash } from '@tabler/icons-react';

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ==============================|| USERS LIST ||============================== //

export default function UsersList() {
  const { users, loading, error, deleteUser, refetch } = useUsers();
  const { user: currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        setDeleteError(null);
        await deleteUser(selectedUser.id);
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        showSnackbar(t('users.userDeleted'), 'success');
      } catch (err: any) {
        console.error('Error deleting user:', err);
        setDeleteError(err?.response?.data?.error?.message || t('messages.serverError'));
      }
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
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
        <Typography variant="h2">{t('users.title')}</Typography>
        <Button variant="contained" startIcon={<IconPlus />} onClick={() => setFormOpen(true)}>
          {t('users.newUser')}
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
                      {t('users.role')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('users.createdAt')}
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
                        {t('users.noUsers')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body1">{user.nombre}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <UserRoleChip role={user.rol} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(user.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {user.id !== currentUser?.id ? (
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(user)} title={t('common.delete')}>
                            <IconTrash />
                          </IconButton>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            (Tú)
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('users.deleteUser')}</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>{t('users.deleteConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Form Dialog */}
      <UserForm open={formOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} />
    </Box>
  );
}
