const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        '/rest/api/2/search',
        createProxyMiddleware({
            target: process.env.REACT_APP_JIRA_URL,
            changeOrigin: true,
        })
    );

    app.use(
        '/v1/search',
        createProxyMiddleware({
            target: process.env.REACT_APP_NOTION_URL,
            changeOrigin: true,
        })
    );
};