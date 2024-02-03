const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(cors({
    origin: ['https://yakshag.github.io', 'https://vivek-nexus.github.io', 'http://localhost:3275', 'https://vivek.nexus', 'https://www.vivek.nexus']
}));




app.get('/health', async (req, res) => {
    res.status(200).send("Server is running")
});



setInterval(() => {
    axios.get('https://render-express-server-q222.onrender.com/health')
        .then(response => {
            console.log('Server pinged:', response.data);
        })
        .catch(error => {
            console.error('Error pinging server:', error.message);
        });
}, 600000);



app.get('/fetch-html', async (req, res) => {
    const { url } = req.query;

    if (String(url).includes("corrieredellacalabria.it")) {
        return res.status(400).json({ error: 'Error. Pass article text as URL param or copy paste article.' });
    }

    if (!url) {
        return res.status(400).json({ error: 'URL is missing query parameters' });
    }

    try {
        const response = await axios.get(url, { maxRedirects: 5 });
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching HTML' });
    }
});



app.get("/slack-on-keys/:code", async (req, res) => {
    const tempCode = req.params.code;
    const oauthUrl = "https://slack.com/api/oauth.v2.access";

    const oauthData = new URLSearchParams();
    oauthData.append('client_id', process.env.SLACK_CLIENT_ID_SLACK_ON_KEYS);
    oauthData.append('client_secret', process.env.SLACK_CLIENT_SECRET_SLACK_ON_KEYS);
    oauthData.append('code', tempCode);

    try {
        const oauthResponse = await axios.post(oauthUrl, oauthData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (oauthResponse.data.ok === true) {
            const token = oauthResponse.data.authed_user.access_token;
            res.status(200).send(token);
        } else {
            res.status(400).send(oauthResponse.data.error);
        }
    } catch (error) {
        res.status(500).send('Error during OAuth request');
    }
});

app.get("/google-meet-slack-integration/:code", async (req, res) => {
    const tempCode = req.params.code;
    const oauthUrl = "https://slack.com/api/oauth.v2.access";

    const oauthData = new URLSearchParams();
    oauthData.append('client_id', process.env.SLACK_CLIENT_ID_GOOGLE_MEET_SLACK_INTEGRATION);
    oauthData.append('client_secret', process.env.SLACK_CLIENT_SECRET_GOOGLE_MEET_SLACK_INTEGRATION);
    oauthData.append('code', tempCode);

    try {
        const oauthResponse = await axios.post(oauthUrl, oauthData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (oauthResponse.data.ok === true) {
            const token = oauthResponse.data.authed_user.access_token;
            res.status(200).send(token);
        } else {
            res.status(400).send(oauthResponse.data.error);
        }
    } catch (error) {
        res.status(500).send('Error during OAuth request');
    }
});




app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
