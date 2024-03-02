import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading animation
import { API_BASE_URL } from '../../../../config';

export default function EnterEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add state for loading animation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Start loading animation
      const formData = new FormData();
      formData.append('ToEmail', email);

      const response = await axios.post(`${API_BASE_URL}/api/Mail/forget`, formData);
      
      if (response.data === "Email exists") {
        // Redirect to OTP page if email exists
        // You can use React Router for navigation
        navigate('/verify');
      } else {
        setError("Email does not exist");
      }
    } catch (exception) {
      console.error('Error:', exception);
      setError("Error occurred. Please try again later.");
    } finally {
      setLoading(false); // Stop loading animation regardless of success or failure
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  return (
    <Box>
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }} spacing={3}>
        <Card sx={{ p: 5, width: 1, maxWidth: 420 }}>
          <Typography variant="h4">Your Email Forget</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField 
                fullWidth
                type="email"
                name="email" 
                label="Email address" 
                value={email}
                onChange={handleChange}  
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
            >
              Submit
            </LoadingButton>
            {/* Show error message if there is an error */}
            {error && <Typography variant="body1" color="error">{error}</Typography>}
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
