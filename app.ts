const express = require('express');
const { collectDefaultMetrics, register, Histogram } = require('prom-client');

const app = express();

// Recopilar métricas por defecto
collectDefaultMetrics();

// Crear un Histogram para la duración de las solicitudes
const httpRequestDurationMicroseconds = new Histogram({
  name: 'nodejs_http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'status_code'], // etiquetas para el método y el código de estado
});

// Middleware para medir la duración de las solicitudes
app.use((req, res, next) => {
  // Registrar el inicio del tiempo
  const start = Date.now();
  // Esperar hasta que se complete la respuesta
  res.on('finish', () => {
    // Calcular la duración
    const duration = (Date.now() - start) / 1000; // Convierte a segundos
    // Registrar la duración en el Histogram con el método y el código de estado
    httpRequestDurationMicroseconds
      .labels(req.method, res.statusCode)
      .observe(duration);
  });
  next();
});

// Ruta para las métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API is running!');
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
