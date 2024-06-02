import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import useURLCompare from '../hooks/useURLCompare';

function URLCompare() {

    const { urlCompare } = useURLCompare();

    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState('');

    const validate = () => {

        let tempErrors = {};
        let isValid = true;

        const urlPattern = new RegExp('^(https?:\\/\\/)?');

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

        if (validate()) {

            try {
                const result = await urlCompare({ url1, url2 });
                console.log(result);
                
                setResponse(result.summary.replace(/\n/g, ''));
            } 
            catch (error) {
                console.error('Error comparing URLs:', error);
                setErrors({ form: 'An error occurred while comparing URLs.' });
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center' }}>
                Website Content Comparison
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={5}>
                    <Paper sx={{ padding: 2, minHeight: '200px', backgroundColor: '#f0f0f0', marginBottom: 2 }}>
                        <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                label="URL 1"
                                type="url"
                                fullWidth
                                variant="outlined"
                                value={url1}
                                onChange={(e) => setUrl1(e.target.value)}
                                sx={{ marginBottom: 2 }}
                                required
                                error={!!errors.url1}
                                helperText={errors.url1}
                            />
                            <TextField
                                label="URL 2"
                                type="url"
                                fullWidth
                                variant="outlined"
                                value={url2}
                                onChange={(e) => setUrl2(e.target.value)}
                                sx={{ marginBottom: 2 }}
                                required
                                error={!!errors.url2}
                                helperText={errors.url2}
                            />
                            {errors.form && <Typography variant="body2" sx={{ color: 'red', marginBottom: 2 }}>{errors.form}</Typography>}
                            <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'center' }}>
                                Compare
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ padding: 2, minHeight: '200px', backgroundColor: '#f9f9f9', marginBottom: 2 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>Comparison Results:</Typography>
                        {response && (
                            <div>
                                <Divider sx={{ marginBottom: 2 }} />
                                <Typography variant="body1">{response}</Typography>
                            </div>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default URLCompare;
