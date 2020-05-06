const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: process.env.REACT_APP_PROXY_LINK,
			changeOrigin: true,
		}),
	);
	app.use(
		'/auth',
		createProxyMiddleware({
			target: process.env.REACT_APP_AUTH_LINK,
			changeOrigin: true,
		}),
	);
};
