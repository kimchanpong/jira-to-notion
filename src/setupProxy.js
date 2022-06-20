// import { createProxyMiddleware } from "http-proxy-middleware"; //이렇게 하면 안되고
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        '/rest/api/2/search',
        createProxyMiddleware({
            target: process.env.REACT_APP_JIRA_URL,
            changeOrigin: true,
        })
    );
};