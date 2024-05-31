import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, List, ListItem, ListItemText, Button } from '@mui/material';

function AppBarComp() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h1"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                            color: 'inherit'
                        }
                    }}
                >
                    ScrapperAI
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default AppBarComp;