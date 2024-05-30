import React, { useState } from 'react';

import useWebCompare from '../hooks/useWebCompare';

function WebContentComparison() {

    const {webCompare} = useWebCompare();

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState('');

    const validate = () => {

        let tempErrors = {};
        let isValid = true;

        if (name.trim() === '') {
            tempErrors.name = 'Name is required.';
            isValid = false;
        }

        const urlPattern = new RegExp(
            '^(https?:\\/\\/)?'
        );
        if (!urlPattern.test(url)) {
            tempErrors.url = 'Enter a valid URL.';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (validate()) {
            const result = await webCompare({ name, url });
            setResponse(result);
        }
    };

    return (
        <div>
            <h1>Website Content Comparison</h1>
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
                <div>
                    <label>URL:</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    {errors.url && <p style={{ color: 'red' }}>{errors.url}</p>}
                </div>
                <button type="submit">Compare</button>
            </form>
            {response && <div><h2>Comparison Result</h2><p>{response.summary}</p></div>}
        </div>
    );
}

export default WebContentComparison;
