import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import api from '../../services/api';

function AddNewsClient() {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'Client name is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            try {
                const response = await api.post('/scanner/add-news-client/', { name });
                if (response.data.error) {
                    setErrorMessage(response.data.message);
                } else {
                    setSuccessMessage('News client added successfully!');
                    setTimeout(() => {
                        navigate('/news-clients', { state: { successMessage: 'News client added successfully!' } });
                    }, 1000); // Delay navigation by 2 seconds
                }
            } catch (error) {
                console.error('Error adding news client:', error);
                setErrorMessage(error.response.data.message);
            }
        }
    };

    return (
        <Container sx={{ marginTop: 0, paddingTop: 15 }}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Add News Client
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Client Name"
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" type="submit" sx={{ padding: 1.5, fontWeight: 'bold' }}>
                            Add Client
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => navigate('/news-clients')} sx={{ padding: 1.5, fontWeight: 'bold' }}>
                            Cancel
                        </Button>
                    </Box>
                </form>
                {successMessage && <Typography variant="h6" align="center" sx={{ color: 'green', marginTop: 2 }}>{successMessage}</Typography>}
                {errorMessage && <Typography variant="h6" align="center" sx={{ color: 'red', marginTop: 2 }}>{errorMessage}</Typography>}
            </Paper>
        </Container>
    );
}

export default AddNewsClient;
