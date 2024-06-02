import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppBarComp from './components/AppBarComp';
import Homepage from './pages/Homepage';
import WebContentComparison from './components/WebContentComparison';
import NewsScrap from './components/NewsScrap';
import TextComparison from './components/TextComparison';
import URLCompare from './components/URLCompare';

function App() {
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
