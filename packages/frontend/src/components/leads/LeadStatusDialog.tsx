import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Stack } from '@mui/material';
import { LeadStatus } from '../../types/lead';
import LeadStatusChip from './LeadStatusChip';

interface LeadStatusDialogProps {
  open: boolean;
  currentStatus: LeadStatus;
  leadName: string;
  onClose: () => void;
  onConfirm: (newStatus: LeadStatus) => void;
}

const getAvailableTransitions = (currentStatus: LeadStatus): LeadStatus[] => {
  switch (currentStatus) {
    case LeadStatus.NUEVO:
      return [LeadStatus.CONTACTADO];
    case LeadStatus.CONTACTADO:
      return [LeadStatus.GANADO, LeadStatus.PERDIDO];
    case LeadStatus.GANADO:
    case LeadStatus.PERDIDO:
      return []; // Estados finales, no se pueden cambiar
    default:
      return [];
  }
};

const getStatusDescription = (status: LeadStatus): string => {
  switch (status) {
    case LeadStatus.NUEVO:
      return 'Lead recién creado, aún no se ha establecido contacto';
    case LeadStatus.CONTACTADO:
      return 'Ya se estableció comunicación con el lead';
    case LeadStatus.GANADO:
      return 'El lead se convirtió en cliente - ¡Venta exitosa!';
    case LeadStatus.PERDIDO:
      return 'El lead no se concretó o rechazó la propuesta';
    default:
      return '';
  }
};

export default function LeadStatusDialog({ open, currentStatus, leadName, onClose, onConfirm }: LeadStatusDialogProps) {
  const availableTransitions = getAvailableTransitions(currentStatus);

  if (availableTransitions.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Lead Status</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>
              The lead <strong>{leadName}</strong> is already in a final state:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <LeadStatusChip status={currentStatus} size="medium" />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              {getStatusDescription(currentStatus)}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
              Final states cannot be changed.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Lead Status</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography>
            Change the status of <strong>{leadName}</strong>:
          </Typography>

          {/* Current Status */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Current Status:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LeadStatusChip status={currentStatus} size="medium" />
              <Typography variant="body2" color="textSecondary">
                {getStatusDescription(currentStatus)}
              </Typography>
            </Box>
          </Box>

          {/* Available Transitions */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
              Select new status:
            </Typography>
            <Stack spacing={2}>
              {availableTransitions.map((status) => (
                <Button
                  key={status}
                  variant="outlined"
                  onClick={() => onConfirm(status)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    p: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2
                    }
                  }}
                >
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <LeadStatusChip status={status} />
                    <Typography variant="body2" color="textSecondary">
                      {getStatusDescription(status)}
                    </Typography>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
