import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import useURLCompare from '../hooks/useURLCompare';
import LoadingScreen from './helpers/LoadingScreen'; // Replace with the correct path to LoadingScreen

function URLCompare() {

    const { urlCompare } = useURLCompare();

    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading screen

    const validate = () => {

        let tempErrors = {};
        let isValid = true;

        const urlPattern = new RegExp('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$');

        if (!urlPattern.test(url1)) {
            tempErrors.url1 = 'Enter a valid URL.';
            isValid = false;
        }

        if (!urlPattern.test(url2)) {
            tempErrors.url2 = 'Enter a valid URL.';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setResponse('');
        setErrors({});
        setLoading(true); // Activate loading screen

        if (validate()) {

            try {
                const result = await urlCompare({ url1, url2 });
                setResponse(result.summary.replace(/\n/g, ''));
            } 
            catch (error) {
                console.error('Error comparing URLs:', error);
                setErrors({ form: 'An error occurred while comparing URLs.' });
            } 
            finally {
                setLoading(false); // Deactivate loading screen
            }
        } 
        else {
            setLoading(false); // Deactivate loading screen if validation fails
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 0, paddingTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Website Content Comparison
            </Typography>
            <Paper sx={{ width: '100%', padding: 2, backgroundColor: '#f0f0f0', marginBottom: 4, position: 'relative' }}>
                <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="URL 1"
                                type="url"
                                fullWidth
                                variant="outlined"
                                value={url1}
                                onChange={(e) => setUrl1(e.target.value)}
                                required
                                error={!!errors.url1}
                                helperText={errors.url1}
                                disabled={loading} // Disable input fields during loading
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="URL 2"
                                type="url"
                                fullWidth
                                variant="outlined"
                                value={url2}
                                onChange={(e) => setUrl2(e.target.value)}
                                required
                                error={!!errors.url2}
                                helperText={errors.url2}
                                disabled={loading} // Disable input fields during loading
                            />
                        </Grid>
                    </Grid>
                    {errors.form && <Typography variant="body2" sx={{ color: 'red', marginTop: 2 }}>{errors.form}</Typography>}
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
                {loading && <LoadingScreen />} {/* Render loading screen when loading is true */}
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
        </Container>
    );
}

export default URLCompare;
