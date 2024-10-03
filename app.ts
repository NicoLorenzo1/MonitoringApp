const express = require('express');
const prometheusMiddleware = require('express-prometheus-middleware');

const app = express();

app.use(prometheusMiddleware({
    metricsPath: '/metrics', // Ruta donde se expondrán las métricas.
    collectDefaultMetrics: true, // Recoge métricas por defecto de Node.js
    requestDurationBuckets: [0.1, 0.5, 1, 1.5], // Configura los rangos de duración de solicitudes HTTP
  }));


const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Endpoint que simula una operación larga
app.get('/long-process', (req, res) => {
    // Simular un retraso de 2 segundos
    setTimeout(() => {
      res.send('Long process completed!');
    }, 2000); // 2000 ms = 2 segundos
  });
  
  // Otro endpoint que simula un proceso más corto
  app.get('/short-process', (req, res) => {
    // Simular un retraso de 500 ms
    setTimeout(() => {
      res.send('Short process completed!');
    }, 500); // 500 ms = 0.5 segundos
  });
  
  // Endpoint que simula un error
  app.get('/error', (req, res) => {
    res.status(500).send('Internal Server Error!');
  });


