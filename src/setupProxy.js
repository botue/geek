const { createProxyMiddleware } = require('http-proxy-middleware')
const baseURL = process.env.REACT_APP_URL

// https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// https://www.npmjs.com/package/http-proxy-middleware

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: baseURL,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  )
}
