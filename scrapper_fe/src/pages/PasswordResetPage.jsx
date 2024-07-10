import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../auth/firebase';

function PasswordResetPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('Password reset email sent. Please check your inbox.');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ marginTop: 0, paddingTop: 15 }}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
                    {success && <Typography color="primary" sx={{ marginBottom: 2 }}>{success}</Typography>}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Send Reset Email'}
                        </Button>
                    </Box>
                </form>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button variant="text" onClick={() => navigate('/login')}>
                        Back to Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default PasswordResetPage;
