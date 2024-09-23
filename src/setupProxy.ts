import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";

module.exports = function (app: any) {
  app.use(
    createProxyMiddleware("/", {
      target: "http://localhost:3000",
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.example.com;"
        );
      },
    }) as RequestHandler
  );
};
