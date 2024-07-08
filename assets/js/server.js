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
    const operatorInfo = `
    You are chatting with EunmaBot, created by Eunma.
    - MBTI: INFP
    - 좋아하는 음식: 스시
    - 취미: 독서와 등산
    `;

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
            prompt: operatorInfo + `\nUser: ${userMessage}\nChatbot:`,
            max_tokens: 150
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        
        const reply = response.data.choices[0].text.trim();
        res.json({ reply });
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        res.status(500).json({ error: 'Error generating chatbot response' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});