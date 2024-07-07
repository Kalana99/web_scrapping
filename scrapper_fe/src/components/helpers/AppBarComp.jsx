import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItemButton, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import logo from '../../assets/logo-removebg-preview.png';

function AppBarComp() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawer = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleDrawerToggle}
            onKeyDown={handleDrawerToggle}
        >
            <List>
                <ListItemButton component={Link} to="/website-comparison">
                    <ListItemText primary="Website Comparison" />
                </ListItemButton>
                <ListItemButton component={Link} to="/news-scraping">
                    <ListItemText primary="News Scraping" />
                </ListItemButton>
                <ListItemButton component={Link} to="/text-comparison">
                    <ListItemText primary="Text Comparison" />
                </ListItemButton>
                <ListItemButton component={Link} to="/url-comparison">
                    <ListItemText primary="URL Comparison" />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ width: 80, height: 80, marginRight: 8 }}
                        />
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                '&:hover': {
                                    color: 'inherit',
                                    opacity: 0.8
                                }
                            }}
                        >
                            ScrapperAI
                        </Typography>
                    </Box>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                            <Button
                                component={Link}
                                to="/website-comparison"
                                color="inherit"
                                sx={{
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff'
                                    }
                                }}
                            >
                                Website Comparison
                            </Button>
                            <Button
                                component={Link}
                                to="/news-scraping"
                                color="inherit"
                                sx={{
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff'
                                    }
                                }}
                            >
                                News Scraping
                            </Button>
                            <Button
                                component={Link}
                                to="/text-comparison"
                                color="inherit"
                                sx={{
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff'
                                    }
                                }}
                            >
                                Text Comparison
                            </Button>
                            <Button
                                component={Link}
                                to="/url-comparison"
                                color="inherit"
                                sx={{
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff'
                                    }
                                }}
                            >
                                URL Comparison
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default AppBarComp;
