const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chatbot', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('http://localhost:8000/chat/', {
            message: userMessage
        });

        const reply = response.data.reply;
        res.json({ reply });
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        res.status(500).json({ error: 'Error generating chatbot response' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
