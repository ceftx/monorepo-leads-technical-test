import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import { withAlpha } from 'utils/colorUtils';

// assets
import { IconFileDescription, IconEdit, IconTrash } from '@tabler/icons-react';

function ListItemWrapper({ children, onClick }) {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: withAlpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

ListItemWrapper.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList({ notifications = [], loading = false, onNotificationClick }) {
  const theme = useTheme();

  // Icon por tipo de notificación
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LEAD_CREATED':
        return <IconFileDescription stroke={1.5} size="20px" />;
      case 'LEAD_STATUS_CHANGED':
        return <IconEdit stroke={1.5} size="20px" />;
      case 'LEAD_DELETED':
        return <IconTrash stroke={1.5} size="20px" />;
      default:
        return <IconFileDescription stroke={1.5} size="20px" />;
    }
  };

  // Color por tipo de notificación
  const getNotificationColor = (type) => {
    switch (type) {
      case 'LEAD_CREATED':
        return { color: 'success.dark', bgcolor: 'success.light' };
      case 'LEAD_STATUS_CHANGED':
        return { color: 'warning.dark', bgcolor: 'warning.light' };
      case 'LEAD_DELETED':
        return { color: 'error.dark', bgcolor: 'error.light' };
      default:
        return { color: 'primary.dark', bgcolor: 'primary.light' };
    }
  };

  // Formatear tiempo relativo
  const getRelativeTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: es
      });
    } catch {
      return 'hace un momento';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary">
          No hay notificaciones
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', py: 0 }}>
      {notifications.map((notification) => (
        <ListItemWrapper key={notification.id} onClick={() => onNotificationClick && onNotificationClick(notification)}>
          <ListItem alignItems="flex-start" disablePadding>
            <ListItemAvatar>
              <Avatar sx={getNotificationColor(notification.type)}>{getNotificationIcon(notification.type)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle2">{notification.message}</Typography>}
              secondary={
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                  {!notification.read ? (
                    <Chip label="Nueva" color="error" size="small" sx={{ width: 'min-content', height: 20 }} />
                  ) : (
                    <Box />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {getRelativeTime(notification.createdAt)}
                  </Typography>
                </Stack>
              }
              secondaryTypographyProps={{ component: 'div' }}
            />
          </ListItem>
        </ListItemWrapper>
      ))}
    </List>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.array,
  loading: PropTypes.bool,
  onNotificationClick: PropTypes.func
};
