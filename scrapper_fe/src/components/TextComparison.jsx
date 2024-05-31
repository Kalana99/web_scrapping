import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import useTextCompare from '../hooks/useTextCompare';

function TextComparison() {
    const { textCompare } = useTextCompare();
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [errors, setErrors] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse('');

        if (text1.trim() !== '' || text2.trim() !== '') {
            try {
                const result = await textCompare({ text1, text2 });
                const formattedResult = result.diff.replace(/\n/g, '');
                setResponse(formattedResult);
            } catch (error) {
                console.error('Error comparing text:', error);
                setErrors('An error occurred while comparing text.');
            }
        } else {
            setErrors('At least one of the fields is required.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center' }}>
                Text Comparison
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={5}>
                    <Paper sx={{ padding: 2, minHeight: '200px', backgroundColor: '#f0f0f0', marginBottom: 2 }}>
                        <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                label="Text 1"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={text1}
                                onChange={(e) => setText1(e.target.value)}
                                sx={{ marginBottom: 2 }}
                                required
                            />
                            <TextField
                                label="Text 2"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={text2}
                                onChange={(e) => setText2(e.target.value)}
                                sx={{ marginBottom: 2 }}
                                required
                            />
                            {errors && <Typography variant="body2" sx={{ color: 'red', marginBottom: 2 }}>{errors}</Typography>}
                            <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'flex-end' }}>
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

export default TextComparison;
