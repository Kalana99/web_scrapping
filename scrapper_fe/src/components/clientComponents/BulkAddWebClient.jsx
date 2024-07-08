import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import api from '../../services/api';

function BulkAddWebClient() {

    const [clients, setClients] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleFileUpload = (e) => {

        setLoading(true);

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {

            const data = event.target.result;

            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                processFileData(jsonData);
            } 
            else {

                Papa.parse(data, {
                    header: true,
                    complete: (results) => {
                        processFileData(results.data);
                    },
                });
            }
        };

        reader.onloadend = () => setLoading(false);
        reader.readAsBinaryString(file);
    };

    const processFileData = (data) => {

        const parsedClients = data.slice(1).map((row) => ({
            name: row[0],
            url: row[1],
        })).filter((client) => client.name && client.url); // Filter out invalid rows

        setClients(parsedClients);
    };

    const handleInputChange = (index, field, value) => {

        const updatedClients = [...clients];
        updatedClients[index][field] = value;

        setClients(updatedClients);
    };

    const handleAddRow = () => {
        setClients([...clients, { name: '', url: '' }]);
    };

    const handleDeleteRow = (index) => {
        const updatedClients = clients.filter((_, i) => i !== index);
        setClients(updatedClients);
    };

    const handleRemoveAll = () => {
        setClients([]);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {
            
            const response = await api.post('/scanner/bulk-add-web-clients/', {clients});

            if (response.data.error) {
                setErrorMessage(response.data.message);
            } 
            else {
                
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    navigate('/web-clients', { state: { successMessage: 'Web clients added successfully!' } });
                }, 1000);
            }
        } 
        catch (error) {
            console.error('Error adding web clients:', error);
            setErrorMessage('An error occurred while adding the web clients.');
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ marginTop: 0, paddingTop: 15 }}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Bulk Add Web Clients
                </Typography>
                <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
                    <input
                        accept=".csv, .xlsx"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                        <Button variant="contained" color="primary" component="span">
                            Upload File
                        </Button>
                    </label>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                        Accepted file types: .csv, .xlsx
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleAddRow} startIcon={<AddIcon />}>
                        Add Row
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleRemoveAll} startIcon={<DeleteForeverIcon />}>
                        Remove All
                    </Button>
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Client Name</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clients.map((client, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                value={client.name}
                                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={client.url}
                                                onChange={(e) => handleInputChange(index, 'url', e.target.value)}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDeleteRow(index)} color="black">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ padding: 1.5, fontWeight: 'bold' }} disabled={loading}>
                        Add Clients
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate('/web-clients')} sx={{ padding: 1.5, fontWeight: 'bold' }}>
                        Cancel
                    </Button>
                </Box>
                {successMessage && <Typography variant="h6" align="center" sx={{ color: 'green', marginTop: 2 }}>{successMessage}</Typography>}
                {errorMessage && <Typography variant="h6" align="center" sx={{ color: 'red', marginTop: 2 }}>{errorMessage}</Typography>}
            </Paper>
        </Container>
    );
}

export default BulkAddWebClient;
