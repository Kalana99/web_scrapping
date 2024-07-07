import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import useWebCompare from '../hooks/useWebCompare';
import LoadingScreen from './helpers/LoadingScreen'; // Import the LoadingScreen component

function WebContentComparison() {

    const { webCompare } = useWebCompare();

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (name.trim() === '') {
            tempErrors.name = 'Name is required.';
            isValid = false;
        }

        const urlPattern = new RegExp('^(https?:\\/\\/)?');
        if (!urlPattern.test(url)) {
            tempErrors.url = 'Enter a valid URL.';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            setLoading(true); // Activate loading state

            try {
                const result = await webCompare({ name, url });
                setResponse(JSON.parse(result.summary.replace(/```json\s*|\s*```/g, '')));
            } catch (error) {
                console.error('Error comparing websites:', error);
                // Handle error if needed
            } finally {
                setLoading(false); // Deactivate loading state
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 0, paddingTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Website Content Comparison
            </Typography>
            <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/web-clients"
                sx={{ margin: 2 }}
            >
                View Web Clients
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0', marginBottom: 2, position: 'relative', minHeight: '200px', width: '100%' }}>
                    {loading && <LoadingScreen />} {/* Render LoadingScreen component when loading is true */}
                    <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '100%' }}>
                        <TextField
                            label="Client Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ marginBottom: 2, width: '100%' }}
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={loading} // Disable input fields and button when loading
                            required
                        />
                        <TextField
                            label="URL"
                            variant="outlined"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            sx={{ marginBottom: 2, width: '100%' }}
                            error={!!errors.url}
                            helperText={errors.url}
                            disabled={loading} // Disable input fields and button when loading
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', fontSize: '1.1rem' }} disabled={loading}>
                            Compare
                        </Button>
                    </form>
                </Paper>
            </Box>
            {response && (
                <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0', width: '100%' }}>
                    <Typography variant="h5" align='center' sx={{ marginBottom: 1 }}>
                        Comparison Results
                    </Typography>
                    {response['Content Additions'] && response['Content Additions'].length > 0 && (
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="subtitle1" fontWeight="fontWeightBold">Content Additions</Typography>
                            <ul>
                                {response['Content Additions'].map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    {response['Content Removals'] && response['Content Removals'].length > 0 && (
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="subtitle1" fontWeight="fontWeightBold">Content Removals</Typography>
                            <ul>
                                {response['Content Removals'].map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    {response['Content Updates'] && response['Content Updates'].length > 0 && (
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="subtitle1" fontWeight="fontWeightBold">Content Updates</Typography>
                            <ul>
                                {response['Content Updates'].map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </Box>
                    )}
                </Paper>
            )}
        </Container>
    );
}

export default WebContentComparison;
