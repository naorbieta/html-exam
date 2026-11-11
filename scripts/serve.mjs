import http from 'node:http';
import { build } from './build.mjs';

const { previewHtml } = await build();
const server = http.createServer(async (request, response) => {
  if (new URL(request.url, 'http://localhost').pathname !== '/') {
    response.writeHead(404); response.end(); return;
  }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(previewHtml);
});
server.listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}`));
