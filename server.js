const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Import the axios library

const app = express();
const port = 3000;

app.use(cors({
    origin: ['https://yakshag.github.io', 'http://localhost:3275']
}));

app.get('/fetch-html', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is missing in query parameters' });
    }

    try {
        const response = await axios.get(url, { maxRedirects: 5 }); // Set maximum number of redirects
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching HTML' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
