// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  // 本地后端API代理
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  )

  // 简道云API代理
  app.use(
    '/jiandaoyun',
    createProxyMiddleware({
      target: 'https://api.jiandaoyun.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/jiandaoyun': '/api/v5' },
      onProxyReq: proxyReq => {
        // 添加认证头
        proxyReq.setHeader('Authorization', 'Bearer your_token_here')
      },
    })
  )
}
