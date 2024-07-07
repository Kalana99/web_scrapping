import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import api from "../../services/api";

function NewsClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/scanner/get-news-clients/');
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    return (
        <Container sx={{ marginTop: 0, paddingTop: 15}}>
            <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold'}}>
                News Client List
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <Button variant="contained" color="primary" component={Link} to="/add-news-client" sx={{ padding: 1.5, fontWeight: 'bold' }}>
                    Add New Client
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/bulk-upload-news" sx={{ padding: 1.5, fontWeight: 'bold' }}>
                    Bulk Upload News Clients
                </Button>
            </Box>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                {loading ? (
                    <Typography variant="h6" align="center" sx={{ color: '#757575' }}>Loading...</Typography>
                ) : clients.length === 0 ? (
                    <Typography variant="h6" align="center" sx={{ color: '#757575' }}>No clients found.</Typography>
                ) : (
                    <List>
                        {clients.map((client) => (
                            <ListItem key={client._id} sx={{ backgroundColor: '#ffffff', marginBottom: 2, borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                <ListItemText 
                                    primary={client.name} 
                                    primaryTypographyProps={{ fontSize: '1.2rem', fontWeight: '500', color: '#424242' }} 
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
}

export default NewsClientList;
