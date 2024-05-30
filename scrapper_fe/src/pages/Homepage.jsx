import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
    return (
        <div>
            <h1>Web Tools</h1>
            <nav>
                <ul>
                    <li><Link to="/website-comparison">Website Content Comparison</Link></li>
                    <li><Link to="/news-scraping">News Scraping</Link></li>
                    <li><Link to="/text-comparison">Text Comparison</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Homepage;
