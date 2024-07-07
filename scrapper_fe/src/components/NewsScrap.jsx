import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import useNewsScrap from '../hooks/useNewsScrap';
import LoadingScreen from './helpers/LoadingScreen'; // Import the LoadingScreen component

function NewsScrap() {

    const { newsScrap } = useNewsScrap();
    
    const [name, setName] = useState('');
    const [errors, setErrors] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setArticles([]);
        setLoading(true); // Activate loading state

        if (name.trim() !== '') {
            try {
                const result = await newsScrap({ name });
                setArticles(result);
            } catch (error) {
                console.error('Error scraping news:', error);
                setErrors('An error occurred while scraping news.');
            } finally {
                setLoading(false); // Deactivate loading state
            }
        } else {
            setErrors('Name is required.');
            setLoading(false); // Deactivate loading state
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 0, paddingTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>
                News Scraping
            </Typography>
            <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/news-clients"
                sx={{ margin: 2 }}
            >
                View News Clients
            </Button>
            <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0', marginBottom: 2, position: 'relative', minHeight: '200px', width: '100%' }}>
                {loading && <LoadingScreen />} {/* Render LoadingScreen component when loading is true */}
                <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '100%' }}>
                    <TextField
                        label="Client Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ marginBottom: 2, width: '100%' }}
                        required
                        disabled={loading} // Disable input fields and button when loading
                    />
                    {errors && <Typography variant="body2" sx={{ color: 'red', marginBottom: 2 }}>{errors}</Typography>}
                    <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', fontSize: '1.1rem' }} disabled={loading}>
                        Scrape News
                    </Button>
                </form>
            </Paper>
            {articles.length > 0 && (
                <div sx={{ marginTop: 2, width: '100%' }}>
                    {articles.map((article, index) => (
                        <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
                            <Typography variant="h6">{article.title}</Typography>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>{article.description}</Typography>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">{article.url}</a>
                        </Paper>
                    ))}
                </div>
            )}
        </Container>
    );
}

export default NewsScrap;
