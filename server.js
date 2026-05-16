const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Proxy API requests to Anthropic
// This replaces the "proxy" field in package.json for production
app.use('/v1', createProxyMiddleware({
  target: 'https://api.anthropic.com',
  changeOrigin: true,
  pathRewrite: {
    '^/v1': '/v1',
  },
  onProxyReq: (proxyReq) => {
    // Ensure the API key from environment variables is used
    if (process.env.REACT_APP_ANTHROPIC_API_KEY) {
      proxyReq.setHeader('x-api-key', process.env.REACT_APP_ANTHROPIC_API_KEY);
    }
  }
}));

// 2. Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// 3. Handle any other requests by serving index.html (for SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
