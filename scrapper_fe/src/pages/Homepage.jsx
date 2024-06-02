import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardActionArea, CardContent } from '@mui/material';

function Homepage() {
    return (
        <div className='container container-fluid mx-auto' style={{ minHeight: '100vh' }}>
            <Container maxWidth="md" sx={{ marginTop: 0, paddingTop: 20, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to ScrapperAI
                </Typography>
                <Grid container spacing={4} sx={{ marginTop: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: '#f0f0f0', boxShadow: 3 }}>
                            <CardActionArea component={Link} to="/website-comparison">
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        Website Content Comparison
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Compare content between websites
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: '#f0f0f0', boxShadow: 3 }}>
                            <CardActionArea component={Link} to="/news-scraping">
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        News Scraping
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Scrape news articles from various sources
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: '#f0f0f0', boxShadow: 3 }}>
                            <CardActionArea component={Link} to="/text-comparison">
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        Text Comparison
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Compare text content for similarities
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: '#f0f0f0', boxShadow: 3 }}>
                            <CardActionArea component={Link} to="/url-comparison">
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        URL Comparison
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Compare content between two URLs
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Homepage;
