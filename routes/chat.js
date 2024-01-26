const WebSocket = require('ws');
const { OpenAI } = require('openai');
require('dotenv').config();

class ChatServer {
    constructor(server, openaiApiKey) {
        this.wss = new WebSocket.Server({ server });
        this.openai = new OpenAI({ apiKey: openaiApiKey });
        this.initialize();
    }

    initialize() {
        this.wss.on('connection', (ws) => {
            let conversationHistory = [];

            ws.on('message', async (userMessage) => {
                try {

                    conversationHistory = JSON.parse(userMessage);
                    console.log(conversationHistory)

                    const stream2 = await this.openai.beta.chat.completions.stream({
                        model: 'gpt-4-1106-preview',
                        // messages: [{ role: 'user', content: 'Say this is a test' }],
                        messages: conversationHistory,
                        stream: true,
                      });

                      stream2.on('content', (delta, snapshot) => {
                        process.stdout.write(delta);
                      });

                      for await (const chunk of stream2) {
                        process.stdout.write(chunk.choices[0]?.delta?.content || '');
                        const response = JSON.stringify(chunk || "");
                        ws.send(response);
                      }
                      const chatCompletion = await stream2.finalChatCompletion();
                      console.log(chatCompletion); // {id: "…", choices: […], …}
                } catch (error) {
                    ws.send('Error: ' + error.message);
                }
            });

            ws.on('close', () => {
                // Reset or remove conversation history if needed
                conversationHistory = [{"role": "system", "content": "You are a helpful assistant."}];
            });
        });
    }
}

module.exports = ChatServer;
