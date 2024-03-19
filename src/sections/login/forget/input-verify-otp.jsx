import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify'; // Assuming this component is in the correct path
import { API_BASE_URL } from '../../../../config';

export default function VerifyOTP() {
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('EnteredOTP', otp);
            formData.append('Password', password);
            formData.append('NewPassword', confirmPassword);
            console.log(otp);
            console.log(password);
            console.log(confirmPassword);   
            // const response = await axios.post(`${API_BASE_URL}/api/Mail/verify-otp`, formData);
            const response = await fetch(`${API_BASE_URL}/api/Mail/verify-otp`, {
                method: 'POST',
                body: formData
                // body: {
                //     'EnteredOTP' : otp,
                //     'Password' : password,
                //     'NewPassword' : confirmPassword
                // }
              });
            if (!otp || !password || !confirmPassword) {
                setError('Please fill in all fields.');
                return;
            }

            if (response.status >= 200 && response.status < 300) {
                navigate('/');
            } else {
                const responseData = await response.json();
                setError(responseData.message || 'An error occurred.');
            }
        } catch (exception) {
            console.error('Error:', exception);
            setError('An error occurred.');
        }
    }

    return (
        <Box
            sx={{
                // Your Box styles here
            }}
        >
            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }} spacing={3}>
                <Card
                    sx={{
                        p: 5,
                        width: 1,
                        maxWidth: 420,
                    }}
                >
                    <Typography variant="h4">Verify OTP and Change Password</Typography>
                    <form onSubmit={handleSubmit} className="container">
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

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="inherit"
                        >
                            Submit
                        </LoadingButton>
                    </form>
                    {error && <p>{error}</p>}
                </Card>
            </Stack>
        </Box>
    );
}
