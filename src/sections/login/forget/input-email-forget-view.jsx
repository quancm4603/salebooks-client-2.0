import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress'; // Thêm LinearProgress
import { LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config';

export default function EnterEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(null); // State to store UserId
  const [otpMismatch, setOtpMismatch] = useState(false); // State to track OTP mismatch
  const [checkingEmail, setCheckingEmail] = useState(false); // State to track email checking
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCheckEmail = async () => {
    try {
      setCheckingEmail(true); // Bắt đầu kiểm tra email
      const formData = new FormData();
      formData.append('ToEmail', email);

      const response = await axios.post(`${API_BASE_URL}/api/Mail/forget`, formData);

      if (response.data) {
        setUserId(response.data); // Store UserId
        setOpenDialog(true);
      } else {
        setError('Email does not exist');
      }
    } catch (exception) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email is Wrong!",
      });
      setError('Email is Wrong!.');
    } finally {
      setCheckingEmail(false); // Kết thúc kiểm tra email
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setOtpMismatch(false); // Reset OTP mismatch state
  };

  const handlePasswordChangeSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('UserId', userId); // Include UserId in form data
      formData.append('EnteredOTP', otp);
      formData.append('Password', password);
      formData.append('NewPassword', confirmPassword);

      if (!otp || !password || !confirmPassword) {
        handleCloseDialog();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Fill in all fields!",
        });
        return;
      }

      if (password !== confirmPassword) {
        setOtpMismatch(true); // Set OTP mismatch state
        handleCloseDialog();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Passwords do not match!",
        });
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/Mail/verify-otp`, formData);
      if (response.status >= 200 && response.status < 300) {
        handleCloseDialog();
        Swal.fire({
          title: "Done!",
          text: "Password changed successfully!",
          icon: "success"
        }).then(() => {
          navigate('/');
        });
      } else {
        handleCloseDialog();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
      }
    } catch (exception) {
      handleCloseDialog();
      setOtpMismatch(true); // Set OTP mismatch state
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "OTP is Wrong!",
      });
    }
  };

  return (
    <Box>
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }} spacing={3}>
        <Card sx={{ p: 5, width: 1, maxWidth: 420 }}>
          <Typography variant="h4">Your Email Forget</Typography>
          <form >
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
            {checkingEmail && <LinearProgress color="secondary" fourColor variant="indeterminate" />} {/* Thay thế LoadingButton bằng LinearProgress */}
            <Button // Thay thế LoadingButton bằng Button để tạm thời vô hiệu hóa nút khi đang kiểm tra email
              fullWidth
              size="large"
              variant="contained"
              color="inherit"
              disabled={checkingEmail} // Disable nút khi đang kiểm tra email
              onClick={handleCheckEmail}
            >
              Submit
            </Button>
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
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      name="password"
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? '👁️' : '👁️'}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? '👁️' : '👁️'}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
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
