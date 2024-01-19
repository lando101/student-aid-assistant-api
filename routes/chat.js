const express = require('express');
const axios = require('axios');
const router = express.Router();
router.use(express.json());

const OpenAI = require('openai');
require('dotenv').config();

// Define your OpenAI API key (replace with your actual API key)
const openaiApiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI
const openai = new OpenAI({openaiApiKey});


router.post('/chat/openai', async (req, res) => {
    try {
      const { prompt } = req.body;
  
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci/completions',
        {
          prompt,
          max_tokens: 50, // Adjust the number of tokens as needed
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
        }
      );
  
      res.json(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while interacting with OpenAI.' });
    }
  });

module.exports = router;
