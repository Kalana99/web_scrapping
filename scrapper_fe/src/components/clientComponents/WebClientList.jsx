import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import api from "../../services/api";

function WebClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/scanner/get-web-clients/');
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
        <Container sx={{ marginTop: 0, paddingTop: 15 }}>
            <Typography variant="h4" sx={{ marginTop: 0, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Web Client List
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <Button variant="contained" color="primary" component={Link} to="/add-web-client">
                    Add New Client
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/bulk-upload-web">
                    Bulk Upload Web Clients
                </Button>
            </Box>
            <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }}>
                {loading ? (
                    <Typography variant="h6" align="center">Loading...</Typography>
                ) : clients.length === 0 ? (
                    <Typography variant="h6" align="center">No clients found.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Client Name</TableCell>
                                    <TableCell>URL</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client._id}>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell>
                                            <MuiLink href={client.url} target="_blank" rel="noopener noreferrer">
                                                {client.url}
                                            </MuiLink>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
}

export default WebClientList;
