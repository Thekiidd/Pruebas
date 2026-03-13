const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain; charset=utf-8';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 500, { error: 'No se pudo cargar la interfaz web.' });
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

async function handleChat(req, res) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: 'Falta OPENROUTER_API_KEY en variables de entorno del servidor.'
    });
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const parsed = JSON.parse(body || '{}');
      const { message, model } = parsed;

      if (!message || typeof message !== 'string') {
        sendJson(res, 400, { error: 'Debes enviar un mensaje válido.' });
        return;
      }

      const selectedModel = model || 'meta-llama/llama-3.1-8b-instruct:free';

      const openRouterResponse = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.OPENROUTER_APP_NAME || 'OpenClaw Web Agent'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: 'Eres un agente útil para ayudar a construir y usar OpenClaw.'
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      const data = await openRouterResponse.json();

      if (!openRouterResponse.ok) {
        sendJson(res, openRouterResponse.status, {
          error: data?.error?.message || 'Error al consultar OpenRouter.'
        });
        return;
      }

      const content = data?.choices?.[0]?.message?.content || 'Sin respuesta del modelo.';
      sendJson(res, 200, { reply: content, raw: data });
    } catch (error) {
      sendJson(res, 500, { error: `Error interno: ${error.message}` });
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/chat') {
    handleChat(req, res);
    return;
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    serveStaticFile(res, path.join(__dirname, 'public', 'index.html'));
    return;
  }

  if (req.method === 'GET' && req.url === '/styles.css') {
    serveStaticFile(res, path.join(__dirname, 'public', 'styles.css'));
    return;
  }

  if (req.method === 'GET' && req.url === '/app.js') {
    serveStaticFile(res, path.join(__dirname, 'public', 'app.js'));
    return;
  }

  sendJson(res, 404, { error: 'Ruta no encontrada.' });
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor iniciado en http://${HOST}:${PORT}`);
});
