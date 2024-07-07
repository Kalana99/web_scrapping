import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import useTextCompare from '../hooks/useTextCompare';
import LoadingScreen from './helpers/LoadingScreen'; // Replace with the correct path to LoadingScreen

function TextComparison() {

    const { textCompare } = useTextCompare();

    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [errors, setErrors] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading screen

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse('');
        setErrors('');
        setLoading(true); // Activate loading screen

        if (text1.trim() !== '' || text2.trim() !== '') {
            try {
                const result = await textCompare({ text1, text2 });
                const formattedResult = result.diff.replace(/\n/g, '');
                setResponse(formattedResult);
            } catch (error) {
                console.error('Error comparing text:', error);
                setErrors('An error occurred while comparing text.');
            } finally {
                setLoading(false); // Deactivate loading screen
            }
        } else {
            setErrors('At least one of the fields is required.');
            setLoading(false); // Deactivate loading screen
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 0, paddingTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Text Comparison
            </Typography>
            <Paper sx={{ width: '100%', padding: 2, backgroundColor: '#f0f0f0', marginBottom: 4 }}>
                <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Text 1"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={text1}
                                onChange={(e) => setText1(e.target.value)}
                                required
                                disabled={loading} // Disable input fields during loading
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Text 2"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={text2}
                                onChange={(e) => setText2(e.target.value)}
                                required
                                disabled={loading} // Disable input fields during loading
                            />
                        </Grid>
                    </Grid>
                    {errors && <Typography variant="body2" sx={{ color: 'red', marginTop: 2 }}>{errors}</Typography>}
                    <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ padding: '10px 20px', fontSize: '16px', width: '200px' }}
                            disabled={loading} // Disable button during loading
                        >
                            Compare
                        </Button>
                    </Grid>
                </form>
            </Paper>
            <Paper sx={{ width: '100%', padding: 2, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Comparison Results:</Typography>
                {response && (
                    <div>
                        <Divider sx={{ marginBottom: 2 }} />
                        <Typography variant="body1">{response}</Typography>
                    </div>
                )}
            </Paper>
            {loading && <LoadingScreen />} {/* Render loading screen when loading is true */}
        </Container>
    );
}

export default TextComparison;
