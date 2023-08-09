const express = require('express');
const http = require('http');
const https = require('https'); // Import the https module
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
    origin: ['https://yakshag.github.io', 'http://localhost:3000']
}));

app.get('/fetch-html', (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is missing in query parameters' });
    }

    const requestOptions = new URL(url);

    const protocolModule = requestOptions.protocol === 'https:' ? https : http;

    const request = protocolModule.get(requestOptions, response => {
        let data = '';

        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            res.send(data);
        });
    });

    request.on('error', error => {
        res.status(500).json({ error: 'Error fetching HTML' });
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
