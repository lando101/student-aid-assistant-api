// swagger.js

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
  apis: [path.resolve(__dirname, './app.js'), path.resolve(__dirname, './thread.js')], // Update with the path to your main Express application
};

const specs = swaggerJsdoc(options);

module.exports = specs;