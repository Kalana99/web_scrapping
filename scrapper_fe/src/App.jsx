import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import WebContentComparison from './components/WebContentComparison';
import NewsScrap from './components/NewsScrap';
import TextComparison from './components/TextComparison';

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Homepage/>} />
                <Route path="/website-comparison" element={<WebContentComparison/>} />
                <Route path="/news-scraping" element={<NewsScrap/>} />
                <Route path="/text-comparison" element={<TextComparison/>} />
            </Routes>
        </Router>
    );
}

export default App;
