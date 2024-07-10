import React from 'react';
import { Typography, Container, Paper, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function VerifyEmailPage() {
    const navigate = useNavigate();

    return (
        <Container sx={{ marginTop: 0, paddingTop: 15 }}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Verify Your Email
                </Typography>
                <Typography align="center">
                    A verification email has been sent to your email address. Please check your inbox and verify your email before logging in.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                    <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                        Go to Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default VerifyEmailPage;