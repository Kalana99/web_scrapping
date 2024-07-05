import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppBarComp from './components/AppBarComp';
import Homepage from './pages/Homepage';
import WebContentComparison from './components/WebContentComparison';
import NewsScrap from './components/NewsScrap';
import TextComparison from './components/TextComparison';
import URLCompare from './components/URLCompare';

import api from './services/api';

function App() {

    useEffect(() => {

        const checkTimeAndCallAPI = () => {

            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            if (hours === 14 && minutes === 43) {
                console.log("about call API")
                callAPI();
            }
        };

        const callAPI = async () => {

            try {

                const web_response = await api.get('/scanner/all-website-scan/');
                console.log(web_response.data.message);

                // const news_response = await api.get('/scanner/all-news-scan/');
                // console.log(news_response.data.message);
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
                </Routes>
            </Router>
        </>
    );
}

export default App;
