import axios from 'axios';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { API_BASE_URL } from '../../../../config';

export default function EnterEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOTPChange = (event) => {
    setOTP(event.target.value);
  };

  const handleCheckEmail = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('ToEmail', email);

      const response = await axios.post(`${API_BASE_URL}/api/Mail/forget`, formData);
      
      if (response.data === 'Email exists') {
        setOpenDialog(true);
      } else {
        setError('Email does not exist');
      }
    } catch (exception) {
      console.error('Error:', exception);
      setError('Error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePasswordChangeSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('EnteredOTP', otp);
      formData.append('Password', password);
      formData.append('NewPassword', confirmPassword);
      
      const response = await axios.post(`${API_BASE_URL}/api/Mail/verify-otp`, formData);
      if (!otp || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }

      if (response.status >= 200 && response.status < 300) {
        // You need to define navigate function for redirection
        // navigate('/');
      } else {
        const responseData = await response.json();
        setError(responseData.message || 'An error occurred.');
      }
    } catch (exception) {
      console.error('Error:', exception);
      setError('An error occurred.');
    }
    handleCloseDialog();
  };


  return (
    <Box>
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }} spacing={3}>
        <Card sx={{ p: 5, width: 1, maxWidth: 420 }}>
          <Typography variant="h4">Your Email Forget</Typography>
          <form>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="email"
                name="email"
                label="Email address"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </Stack>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              // Show loading animation if loading state is true
              loading={loading}
              // Disabled button if loading state is true
              disabled={loading}
              onClick={handleCheckEmail}
            >
              Submit
            </LoadingButton>
            {/* Show error message if there is an error */}
            {error && <Typography variant="body1" color="error">{error}</Typography>}
          </form>


          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }} spacing={3}>
              <Card
                sx={{
                  p: 5,
                  width: 1,
                  maxWidth: 420,
                }}
              >
                <DialogTitle>OTP and Password</DialogTitle>
                <DialogContent>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      name="otp"
                      label="OTP"
                      type="text"
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      name="password"
                      label="New Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="inherit"
                    onClick={handlePasswordChangeSubmit}
                  >
                    Submit
                  </LoadingButton>
                </DialogActions>
              </Card>
            </Stack>
          </Dialog>
        </Card>
      </Stack>
    </Box>
  );
}