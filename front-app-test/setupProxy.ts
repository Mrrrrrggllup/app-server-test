import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // Remplace avec l'URL de ton API backend
      changeOrigin: true,
    })
  );
};