import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import { NAV, HEADER } from './config-layout';
import AccountPopover from './common/account-popover';
import LanguagePopover from './common/language-popover';
import { API_BASE_URL } from '../../../config';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav, accountInfo }) {
  const theme = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check if the user is already authenticated (e.g., by checking a token in local storage)
    const isAuthenticated = localStorage.getItem('token'); // Replace 'token' with your actual storage key
    // get local storage email
    const storedEmail = sessionStorage.getItem('email');

    if (isAuthenticated) {
      setLoggedIn(true);
      setToken(isAuthenticated);
      setEmail(storedEmail);
    }
  }, []);

  // useEffect(() => {
  //   const getAccountInfo = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/api/Account/accountInfo`, {
  //         headers: {
  //           Accept: 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setAccountInfo({
  //           displayName: data.name,
  //           role: data.role ? 'Admin' : 'User',
  //           email: data.email,
  //         });
  //       } else {
  //         console.error('Error fetching account info:', response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching account info:', error.message);
  //     }
  //   };

  //   getAccountInfo();
  // }, [token]);

  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <LanguagePopover />
      
        <AccountPopover
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          token={token}
          setToken={setToken}
          accountInfo={accountInfo} // Pass accountInfo as a prop
        />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
  accountInfo: PropTypes.object.isRequired,
};
