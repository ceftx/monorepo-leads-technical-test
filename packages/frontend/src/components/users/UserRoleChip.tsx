import { Chip } from '@mui/material';
import { UserRole } from '../../types/user';

interface UserRoleChipProps {
  role: UserRole;
  size?: 'small' | 'medium';
}

const getRoleConfig = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return {
        label: 'Admin',
        color: 'secondary' as const
      };
    case UserRole.VENDEDOR:
      return {
        label: 'Vendedor',
        color: 'primary' as const
      };
    default:
      return {
        label: role,
        color: 'default' as const
      };
  }
};

export default function UserRoleChip({ role, size = 'small' }: UserRoleChipProps) {
  const config = getRoleConfig(role);

  return <Chip label={config.label} color={config.color} size={size} sx={{ fontWeight: 500 }} />;
}
