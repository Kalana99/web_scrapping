import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, List, ListItem, ListItemText, Button } from '@mui/material';

function Homepage() {
    return (
        <div className='container container-fluid mx-auto'>
            <Container maxWidth="md" sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to Web Tools
                </Typography>
                <List sx={{ mt: 2 }}>
                    <ListItem sx={{ mb: 2 }}>
                        <Button variant="outlined" component={Link} to="/website-comparison" fullWidth>
                            <ListItemText primary="Website Content Comparison" />
                        </Button>
                    </ListItem>
                    <ListItem sx={{ mb: 2 }}>
                        <Button variant="outlined" component={Link} to="/news-scraping" fullWidth>
                            <ListItemText primary="News Scraping" />
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button variant="outlined" component={Link} to="/text-comparison" fullWidth>
                            <ListItemText primary="Text Comparison" />
                        </Button>
                    </ListItem>
                </List>
            </Container>
        </div>
    );
}

export default Homepage;
