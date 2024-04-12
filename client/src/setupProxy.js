const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware(['/api', '/auth', '/libraries', '/oauth', '/wss'], {
      target: 'http://localhost:4000',
      changeOrigin: true,
      ws: true,
    })
  );
};
