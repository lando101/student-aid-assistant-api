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
                    // Append user message to the conversation history
                    // conversationHistory.push({"role": "user", "content": userMessage});

                    conversationHistory = JSON.parse(userMessage);
                    console.log(conversationHistory)
                    // const stream = await this.openai.chat.completions.create({
                    //     model: "gpt-4-1106-preview",
                    //     messages: conversationHistory,
                    //     stream: true,
                    // });

                    const stream2 = await this.openai.beta.chat.completions.stream({
                        model: 'gpt-4',
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

                    // const stream = await this.openai.chat.completions.create({
                    //     model: "gpt-3.5-turbo-1106",
                    //     messages: [
                    //       {
                    //         role: "system",
                    //         content:
                    //           "You are a helpful assistant. Your response should be in JSON format.",
                    //       },
                    //       { role: "user", content: "Hello!" },
                    //     ],
                    //     stream: true,
                    //   });

                    // for await (const chunk of stream) {
                    //     if (chunk.choices[0]?.delta?.content) {
                    //         // ws.send(chunk.choices[0].delta.content);
                    //         const response = JSON.stringify(chunk || "");
                    //         ws.send(response);

                    //         // ws.send(chunk.choices[0]);


                    //         // Optionally, append OpenAI's response to the conversation history
                    //         conversationHistory.push({"role": "assistant", "content": chunk.choices[0].delta.content});
                    //     }
                    // }
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
