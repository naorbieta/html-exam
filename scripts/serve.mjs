import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build } from './build.mjs';

const { preview } = await build();
const server = http.createServer(async (request, response) => {
  if (new URL(request.url, 'http://localhost').pathname !== '/') {
    response.writeHead(404); response.end(); return;
  }
  try {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(await readFile(path.join(preview, 'index.html')));
  } catch (error) { response.writeHead(500); response.end(error.message); }
});
server.listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}`));
