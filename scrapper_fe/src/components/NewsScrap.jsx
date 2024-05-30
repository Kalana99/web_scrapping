import React, { useState } from 'react';

import useNewsScrap from '../hooks/useNewsScrap';

function NewsScrap() {

    const { newsScrap } = useNewsScrap();

    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const [articles, setArticles] = useState([]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (name.trim() !== '') {
            const result = await newsScrap({ name });
            console.log(result)
            setArticles(result);
        } 
        else {
            setErrors({ name: 'Name is required.' });
        }
    };

    return (
        <div>
            <h1>News Scraping</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Client Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </div>
                <br />
                <button type="submit">Scrape News</button>
            </form>
            <div>
                {articles.map((article, index) => (
                    <div key={index}>
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                        <a href={article.url}>{article.url}</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewsScrap;
