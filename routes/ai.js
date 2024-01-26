const express = require('express');
const axios = require('axios');
const router = express.Router();
const OpenAI = require('openai');

require('dotenv').config();
router.use(express.json());

// Define your OpenAI API key (replace with your actual API key)
const openaiApiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI
const openai = new OpenAI({openaiApiKey});


/**
 * @swagger
 * /api/generate-questions:
 *   post:
 *     summary: Generate questions based on provided text
 *     description: This endpoint takes a string of text and returns three follow-up questions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to generate questions from.
 *                 example: "Describe the process of photosynthesis."
 *     responses:
 *       200:
 *         description: Successfully generated questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 choices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                         example: "What are the stages of photosynthesis?"
 *       400:
 *         description: Invalid request (e.g., missing text)
 *       500:
 *         description: Internal server error
 */
router.post('/generate-questions', async (req, res) => {
    try {
        const content = req.body.text; 
        const prompt = `Given the following text, provide three follow-up questions in a JSON array format:

        ${content}
        
        Format the response as follows:
        ["First question?", "Second question?", "Third question?"]`;

        if (!content) {
          return res.status(400).json({ error: 'Content is required' });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: content },
            ],
            model: "gpt-3.5-turbo",
        });
        // console.log(JSON.parse(completion.choices[0]))
        res.json(completion.choices[0]); // Send back only the relevant part of the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while interacting with OpenAI.' });
    }
});

module.exports = router;