import React, { useState } from 'react';

import useTextCompare from '../hooks/useTextCompare';

function TextComparison() {

    const {textCompare} = useTextCompare();

    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState({});

    const handleSubmit = async (e) => {

        e.preventDefault();
        setResponse({});

        if (text1.trim() !== '' || text2.trim() !== '') {

            const result = await textCompare({ text1, text2 });
            const formatedResult = result.diff.replace(/\n/g, '');

            console.log(formatedResult)
            
            setResponse({"diff": formatedResult});
        } 
        else {
            setErrors({ text: 'At least one of the fields are required.' });
        }
    };

    return (
        <div>
            <h1>Text Comparison</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Text 1:
                    <textarea value={text1} onChange={(e) => setText1(e.target.value)} required />
                </label>
                <br />
                <label>
                    Text 2:
                    <textarea value={text2} onChange={(e) => setText2(e.target.value)} required />
                </label>
                <br />
                {errors.text && <p style={{ color: 'red' }}>{errors.text}</p>}
                <br />
                <button type="submit">Compare</button>
            </form>
            {response && <div><h2>Comparison Result</h2><p>{response.diff}</p></div>}
        </div>
    );
}

export default TextComparison;
