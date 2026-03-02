import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// material-ui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert, CircularProgress } from '@mui/material';

// project imports
import { useLeads } from '../../hooks/useLeads';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Lead, CreateLeadDto } from '../../types/lead';

// Validation schema
const leadSchema = z.object({
  nombre: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  empresa: z.string().min(2, 'Company must be at least 2 characters'),
  montoEstimado: z.number().min(0, 'Amount must be positive')
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead | null;
}

// ==============================|| LEAD FORM ||============================== //

export default function LeadForm({ open, onClose, onSuccess, lead }: LeadFormProps) {
  const { createLead } = useLeads();
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LeadFormData>({
    // @ts-ignore - Zod version conflict
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nombre: '',
      email: '',
      empresa: '',
      montoEstimado: 0
    }
  });

  // Reset form when dialog opens/closes or lead changes
  useEffect(() => {
    if (open) {
      if (lead) {
        reset({
          nombre: lead.nombre,
          email: lead.email,
          empresa: lead.empresa,
          montoEstimado: lead.montoEstimado
        });
      } else {
        reset({
          nombre: '',
          email: '',
          empresa: '',
          montoEstimado: 0
        });
      }
      setError(null);
    }
  }, [open, lead, reset]);

  const onSubmit = async (data: LeadFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const leadData: CreateLeadDto = {
        nombre: data.nombre,
        email: data.email,
        empresa: data.empresa,
        montoEstimado: Number(data.montoEstimado)
      };

      if (lead) {
        // TODO: Implement update functionality when backend supports it
        throw new Error('Update functionality not yet implemented');
      } else {
        await createLead(leadData);
        showSnackbar('Lead created successfully', 'success');
      }

      onSuccess();
    } catch (err: any) {
      console.error('Form error:', err);
      setError(err?.response?.data?.error?.message || err.message || 'Failed to save lead');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{lead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="empresa"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Company"
                  fullWidth
                  error={!!errors.empresa}
                  helperText={errors.empresa?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="montoEstimado"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Estimated Amount (ARS)"
                  type="number"
                  fullWidth
                  error={!!errors.montoEstimado}
                  helperText={errors.montoEstimado?.message}
                  disabled={isLoading}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : lead ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
