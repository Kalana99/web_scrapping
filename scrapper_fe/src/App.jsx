import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppBarComp from './components/helpers/AppBarComp';
import Homepage from './pages/Homepage';
import WebContentComparison from './components/WebContentComparison';
import NewsScrap from './components/NewsScrap';
import TextComparison from './components/TextComparison';
import URLCompare from './components/URLCompare';

import WebClientList from './components/clientComponents/WebClientList';
import AddWebClient from './components/clientComponents/AddWebClient';
// import BulkUploadWeb from './components/BulkUploadWeb';

import NewsClientList from './components/clientComponents/NewsClientList';
import AddNewsClient from './components/clientComponents/AddNewsClient';
// import BulkUploadNews from './components/BulkUploadNews';

import api from './services/api';

function App() {

    useEffect(() => {

        const checkTimeAndCallAPI = () => {

            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            if (hours === 18 && minutes === 7) {
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
        <>
            <Router>
                <AppBarComp />
                <Routes>
                    <Route exact path="/" element={<Homepage />} />
                    <Route path="/website-comparison" element={<WebContentComparison />} />
                    <Route path="/news-scraping" element={<NewsScrap />} />
                    <Route path="/text-comparison" element={<TextComparison />} />
                    <Route path="/url-comparison" element={<URLCompare />} />

                    <Route path="/web-clients" element={<WebClientList />} />
                    <Route path="/add-web-client" element={<AddWebClient />} />
                    {/* <Route path="/bulk-upload-web" element={<BulkUploadWeb />} /> */}

                    <Route path="/news-clients" element={<NewsClientList />} />
                    <Route path="/add-news-client" element={<AddNewsClient />} />
                    {/* <Route path="/bulk-upload-news" element={<BulkUploadNews />} /> */}
                </Routes>
            </Router>
        </>
    );
}

export default App;
