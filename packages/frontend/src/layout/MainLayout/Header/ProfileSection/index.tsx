import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import { useAuth } from 'contexts/AuthContext';

// assets
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconChevronDown } from '@tabler/icons-react';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const {
    state: { borderRadius }
  } = useConfig();

  const [open, setOpen] = useState(false);

  const anchorRef = useRef<any>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        slotProps={{ label: { sx: { lineHeight: 0 } } }}
        sx={{ ml: 2, height: '48px', alignItems: 'center', borderRadius: '27px', cursor: 'pointer' }}
        icon={<Avatar src={User1} alt="user-images" sx={{ typography: 'mediumAvatar', margin: '8px 0 8px 8px !important' }} />}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {user?.nombre || 'User'}
            </Typography>
            <IconChevronDown stroke={1.5} size="16px" />
          </Box>
        }
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        variant="outlined"
        aria-label="user-account"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        {/* User Info */}
                        <Stack spacing={0.5}>
                          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="h4">Welcome,</Typography>
                            <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                              {user?.nombre || 'User'}
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle2" color="textSecondary">
                            {isAdmin ? 'Administrator' : 'Sales Representative'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user?.email}
                          </Typography>
                        </Stack>

                        <Divider />

                        {/* Logout Button */}
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            minWidth: 250,
                            borderRadius: `${borderRadius}px`,
                            p: 0
                          }}
                        >
                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleLogout}>
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                          </ListItemButton>
                        </List>
                      </Stack>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
