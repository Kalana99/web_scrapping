import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../auth/firebase';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                setUser(userCredential.user);
                setError('Email not verified. Please verify your email.');
                setLoading(false);
                return;
            }
            navigate('/home');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (user) {
            await sendEmailVerification(user);
            setError('Verification email resent. Please check your inbox.');
        }
    };

    return (
        <Container sx={{ marginTop: 0, paddingTop: 15 }}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Login
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
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <>
                            <Typography color="error" sx={{ marginBottom: 2 }}>
                                {error}
                            </Typography>
                            {user && (
                                <Button variant="contained" color="primary" onClick={handleResendVerification}>
                                    Resend Verification Email
                                </Button>
                            )}
                        </>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </Box>
                </form>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button variant="text" onClick={() => navigate('/reset-password')}>
                        Forgot Password?
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPage;
