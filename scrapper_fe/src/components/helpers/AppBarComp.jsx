import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-removebg-preview.png';

function AppBarComp() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleLogout = () => {
        logout();
        handleDialogClose();
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
                {user && (
                    <ListItemButton onClick={handleDialogOpen}>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                )}
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
                                    opacity: 0.8,
                                },
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
                                        color: '#ffffff',
                                    },
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
                                        color: '#ffffff',
                                    },
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
                                        color: '#ffffff',
                                    },
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
                                        color: '#ffffff',
                                    },
                                }}
                            >
                                URL Comparison
                            </Button>
                            {user && (
                                <Button
                                    color="inherit"
                                    onClick={handleDialogOpen}
                                    sx={{
                                        fontSize: '1rem',
                                        padding: '0.75rem 1.5rem',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            )}
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
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Logout Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogout} color="primary" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AppBarComp;
