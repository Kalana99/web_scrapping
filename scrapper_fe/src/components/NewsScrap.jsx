import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import useNewsScrap from '../hooks/useNewsScrap';

function NewsScrap() {

    const { newsScrap } = useNewsScrap();
    
    const [name, setName] = useState('');
    const [errors, setErrors] = useState('');
    const [articles, setArticles] = useState([]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setArticles([]);

        if (name.trim() !== '') {

            try {
                const result = await newsScrap({ name });
                setArticles(result);
            } 
            catch (error) {
                console.error('Error scraping news:', error);
                setErrors('An error occurred while scraping news.');
            }
        } 
        else {
            setErrors('Name is required.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center' }}>
                News Scraping
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0', marginBottom: 2 }}>
                <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        label="Client Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ marginBottom: 2, width: '100%' }}
                        required
                    />
                    {errors && <Typography variant="body2" sx={{ color: 'red', marginBottom: 2 }}>{errors}</Typography>}
                    <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
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
