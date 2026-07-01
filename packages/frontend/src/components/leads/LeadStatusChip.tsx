import { Chip, keyframes } from '@mui/material';
import { LeadStatus } from '../../types/lead';
import { IconHandClick } from '@tabler/icons-react';

interface LeadStatusChipProps {
  status: LeadStatus;
  size?: 'small' | 'medium';
  clickable?: boolean;
  onClick?: () => void;
}

// Animación de respiración (pulsing)
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const getStatusConfig = (status: LeadStatus) => {
  switch (status) {
    case LeadStatus.NUEVO:
      return {
        label: 'Nuevo',
        color: 'primary' as const
      };
    case LeadStatus.CONTACTADO:
      return {
        label: 'Contactado',
        color: 'warning' as const,
        // Custom orange color for better visibility
        customColor: {
          bgcolor: '#fff3e0',
          textColor: '#e65100'
        }
      };
    case LeadStatus.GANADO:
      return {
        label: 'Ganado',
        color: 'success' as const,
        // Custom green - darker for better visibility
        customColor: {
          bgcolor: '#e8f5e9',
          textColor: '#1b5e20'
        }
      };
    case LeadStatus.PERDIDO:
      return {
        label: 'Perdido',
        color: 'error' as const
      };
    default:
      return {
        label: status,
        color: 'default' as const
      };
  }
};

export default function LeadStatusChip({ status, size = 'small', clickable = false, onClick }: LeadStatusChipProps) {
  const config = getStatusConfig(status);
  const isFinalStatus = status === LeadStatus.GANADO || status === LeadStatus.PERDIDO;
  const hasCustomColor = status === LeadStatus.CONTACTADO || status === LeadStatus.GANADO;

  // Custom styles for CONTACTADO (orange) and GANADO (green) for better visibility
  const customStyles =
    hasCustomColor && config.customColor
      ? {
          bgcolor: config.customColor.bgcolor,
          color: config.customColor.textColor,
          '& .MuiChip-icon': {
            color: config.customColor.textColor
          }
        }
      : {};

  return (
    <Chip
      label={config.label}
      color={hasCustomColor ? 'default' : config.color}
      size={size}
      onClick={clickable ? onClick : undefined}
      icon={clickable && !isFinalStatus ? <IconHandClick size={16} /> : undefined}
      sx={{
        fontWeight: 500,
        ...customStyles,
        ...(clickable &&
          !isFinalStatus && {
            cursor: 'pointer',
            animation: `${pulse} 2s infinite`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 3,
              animation: 'none'
            }
          }),
        ...(isFinalStatus && {
          opacity: 0.8
        })
      }}
    />
  );
}
