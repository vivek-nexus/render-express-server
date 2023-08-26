const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(cors({
    origin: ['https://yakshag.github.io', 'http://localhost:3275']
}));




app.get('/health', async (req, res) => {
    res.status(200).send("Server is running")
});



setInterval(() => {
    axios.get('https://render-express-server-q222.onrender.com/health') // Replace with your Render app's URL
        .then(response => {
            console.log('Server pinged:', response.data);
        })
        .catch(error => {
            console.error('Error pinging server:', error.message);
        });
}, 600000);



app.get('/fetch-html', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is missing in query parameters' });
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
    const analyticsUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=425970658&text=slack-on-keys,%20new-slack-token-generated&parse_mode=Markdown`;

    const oauthData = new URLSearchParams();
    oauthData.append('client_id', process.env.SLACK_CLIENT_ID);
    oauthData.append('client_secret', process.env.SLACK_CLIENT_SECRET);
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

    try {
        await axios.post(analyticsUrl);
        console.log('Anonymous analytics');
    } catch (error) {
        console.error('Error sending analytics:', error);
    }
});




app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
