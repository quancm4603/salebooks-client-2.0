import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import { account } from 'src/_mock/account';

import { API_BASE_URL } from '../../../../config'; // Import your API_BASE_URL
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

AccountPopover.propTypes = {
  loggedIn: PropTypes.bool,
  setLoggedIn: PropTypes.func,
  token: PropTypes.string,
  setToken: PropTypes.func,
};

export default function AccountPopover({ loggedIn, setLoggedIn, token, setToken }) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const [account, setAccount] = useState({});

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    // Perform logout actions (clear local storage, reset state, etc.)
    localStorage.removeItem('jwttoken');
    sessionStorage.removeItem('email');
    
    // Update state to reflect logout status
    setLoggedIn(false);
    setToken('');

    // Navigate to the login page
    window.location.href = '/login'; // You can use react-router-dom's history for navigation as well
  };

  

  useEffect(() => {
    console.log('token account popo :', token);
    setToken(token);

    const getAccountInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Account/accountInfo`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccount({
            displayName: data.name,
            role: data.role ? 'Admin' : 'User',
            email: data.email,
          });
        } else {
          console.error('Error fetching account info:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching account info:', error.message);
      }
    };

    getAccountInfo();
  }, [token, setToken]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
