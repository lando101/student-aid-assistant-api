const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const OpenAI = require('openai');
require('dotenv').config();
const port = process.env.PORT || 3000;

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

// Import and use threads routes
const threadsRoutes = require('./thread'); // Adjust the path if necessary
app.use('/api', threadsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
