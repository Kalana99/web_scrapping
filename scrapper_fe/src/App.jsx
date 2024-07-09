import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppBarComp from './components/helpers/AppBarComp';

import StartupPage from './pages/StartupPage';
import LoginPage from './components/authComponents/LoginPage';
import SignupPage from './components/authComponents/SignupPage';
import ProtectedRoute from './components/authComponents/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Homepage from './pages/Homepage';
import WebContentComparison from './components/WebContentComparison';
import NewsScrap from './components/NewsScrap';
import TextComparison from './components/TextComparison';
import URLCompare from './components/URLCompare';

import WebClientList from './components/clientComponents/WebClientList';
import AddWebClient from './components/clientComponents/AddWebClient';
import BulkAddWebClient from './components/clientComponents/BulkAddWebClient';

import NewsClientList from './components/clientComponents/NewsClientList';
import AddNewsClient from './components/clientComponents/AddNewsClient';
import BulkAddNewsClient from './components/clientComponents/BulkAddNewsClient';

import api from './services/api';

function App() {

    useEffect(() => {

        const checkTimeAndCallAPI = () => {

            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            if (hours === 9 && minutes === 0) {
                callAPI();
            }
        };

        const callAPI = async () => {

            try {

                const web_response = await api.get('/scanner/all-website-scan/');
                console.log(web_response.data.message);

                const news_response = await api.get('/scanner/all-news-scan/');
                console.log(news_response.data.message);
            }
            catch (error) {
                console.error('Error calling the API:', error);
            }
        };

        const intervalId = setInterval(checkTimeAndCallAPI, 60000); // 60000 ms = 1 minute

        return () => clearInterval(intervalId);
    }, []);

    return (
        <AuthProvider>
            <Router>
                <AppBarComp />
                <Routes>
                    <Route exact path="/" element={<StartupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
                    <Route path="/website-comparison" element={<ProtectedRoute><WebContentComparison /></ProtectedRoute>} />
                    <Route path="/news-scraping" element={<ProtectedRoute><NewsScrap /></ProtectedRoute>} />
                    <Route path="/text-comparison" element={<ProtectedRoute><TextComparison /></ProtectedRoute>} />
                    <Route path="/url-comparison" element={<ProtectedRoute><URLCompare /></ProtectedRoute>} />

                    <Route path="/web-clients" element={<ProtectedRoute><WebClientList /></ProtectedRoute>} />
                    <Route path="/add-web-client" element={<ProtectedRoute><AddWebClient /></ProtectedRoute>} />
                    <Route path="/bulk-upload-web" element={<ProtectedRoute><BulkAddWebClient /></ProtectedRoute>} />

                    <Route path="/news-clients" element={<ProtectedRoute><NewsClientList /></ProtectedRoute>} />
                    <Route path="/add-news-client" element={<ProtectedRoute><AddNewsClient /></ProtectedRoute>} />
                    <Route path="/bulk-upload-news" element={<ProtectedRoute><BulkAddNewsClient /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
