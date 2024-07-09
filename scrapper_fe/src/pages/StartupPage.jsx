import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Paper,
    Box
} from '@mui/material';

function StartupPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <Container sx={{ marginTop: 0, paddingTop: 15 }}>
            <Paper sx={{ padding: 5, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h3" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Welcome to ScrapperAI
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: 5, textAlign: 'center' }}>
                    Please login or signup to continue...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleLoginClick} sx={{ padding: 1.5, fontWeight: 'bold', width: 150 }}>
                        Login
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleSignupClick} sx={{ padding: 1.5, fontWeight: 'bold', width: 150 }}>
                        Signup
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default StartupPage;
