const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0', // Especifica la versión de OpenAPI
    info: {
      title: 'API de Productos y Carrito', // Nombre de tu API
      version: '1.0.0', // Versión de tu API
      description: 'Documentación de la API de Productos y Carrito', // Descripción de tu API
    },
    servers: [
      {
        url: 'http://localhost:3000', // La URL de tu servidor
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Rutas a los archivos de tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
