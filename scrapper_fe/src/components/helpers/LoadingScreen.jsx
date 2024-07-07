import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
    return (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
            <CircularProgress color="inherit" size={50} />
            <Typography variant="body1" style={{ marginLeft: 10 }}>
                Processing...
            </Typography>
        </Backdrop>
    );
};

export default LoadingScreen;
