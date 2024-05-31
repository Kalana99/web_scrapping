import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import useWebCompare from '../hooks/useWebCompare';

function WebContentComparison() {

    const { webCompare } = useWebCompare();

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState('');

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
            const result = await webCompare({ name, url });
            setResponse(result);
        }
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center' }}>
                Website Content Comparison
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0', marginBottom: 2 }}>
                <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        label="Client Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ marginBottom: 2, width: '100%' }}
                        error={!!errors.name}
                        helperText={errors.name}
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
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
                        Compare
                    </Button>
                </form>
            </Paper>
            {response && (
                <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0', width: '100%' }}>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        Comparison Result
                    </Typography>
                    <Typography variant="body1">
                        {response.summary}
                    </Typography>
                </Paper>
            )}
        </Container>
    );
}

export default WebContentComparison;
