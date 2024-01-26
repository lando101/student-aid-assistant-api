const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);

require('dotenv').config();
const openaiApiKey = process.env.OPENAI_API_KEY;
const port = process.env.PORT || 3000;

// Import ChatServer
const ChatServer = require('./routes/chat');

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Apply CORS middleware
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Parse JSON payloads
app.use(express.json());

// Serve Swagger UI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import and use routes
const threadsRoutes = require('./routes/thread'); // Adjust the path if necessary
const aiRoutes = require('./routes/ai'); // Adjust the path if necessary
app.use('/api', threadsRoutes, aiRoutes);

// Initialize ChatServer with the HTTP server and OpenAI API key
new ChatServer(server, openaiApiKey);

// Start the server using server.listen() not app.listen()
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
