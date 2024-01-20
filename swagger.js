const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'OpenAI Express API',
      version: '1.0.0',
      description: 'API documentation for the OpenAI Express API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your server URL
        description: 'Local Development Server',
      },
    ],
  },
  // Update here to include chat.js
  apis: [
    path.resolve(__dirname, './app.js'), 
    path.resolve(__dirname, './routes/thread.js'),
    path.resolve(__dirname, './routes/chat.js') // Add the path to your chat.js
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
