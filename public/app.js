const sendBtn = document.getElementById('sendBtn');
const promptInput = document.getElementById('prompt');
const modelInput = document.getElementById('model');
const resultBox = document.getElementById('result');
const statusBox = document.getElementById('status');
const modeSelect = document.getElementById('mode');
const apiKeyWrap = document.getElementById('apiKeyWrap');
const apiKeyInput = document.getElementById('apiKey');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function setStatus(message) {
  statusBox.textContent = message;
}

function getSelectedMode() {
  return modeSelect.value;
}

function updateModeUI() {
  const mode = getSelectedMode();
  const showClientKey = mode === 'client';
  apiKeyWrap.classList.toggle('hidden', !showClientKey);

  if (mode === 'backend') {
    setStatus('Modo backend: la API key se queda en el servidor.');
  } else if (mode === 'client') {
    setStatus('Modo cliente: útil para GitHub Pages, pero menos seguro.');
  } else {
    setStatus('Modo auto: intenta backend y si no existe, usa cliente.');
  }
}

async function callBackend(message, model) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, model })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'No se pudo obtener respuesta del backend.');
  }

  return data.reply;
}

async function callOpenRouterClient(message, model, apiKey) {
  if (!apiKey) {
    throw new Error('Falta API key para modo cliente.');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'OpenClaw Web Agent (Static)'
    },
    body: JSON.stringify({
      model,
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Error directo contra OpenRouter.');
  }

  return data?.choices?.[0]?.message?.content || 'Sin respuesta del modelo.';
}

sendBtn.addEventListener('click', async () => {
  const message = promptInput.value.trim();
  const model = modelInput.value.trim() || 'meta-llama/llama-3.1-8b-instruct:free';
  const mode = getSelectedMode();
  const apiKey = apiKeyInput.value.trim();

  if (!message) {
    resultBox.textContent = 'Escribe un mensaje antes de enviar.';
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Consultando...';
  resultBox.textContent = 'Generando respuesta...';

  try {
    let reply = '';

    if (mode === 'backend') {
      reply = await callBackend(message, model);
    } else if (mode === 'client') {
      reply = await callOpenRouterClient(message, model, apiKey);
    } else {
      try {
        reply = await callBackend(message, model);
        setStatus('Auto: backend detectado y funcionando ✅');
      } catch (_error) {
        reply = await callOpenRouterClient(message, model, apiKey);
        setStatus('Auto: backend no disponible, usando modo cliente ⚠️');
      }
    }

    resultBox.textContent = reply;
  } catch (error) {
    resultBox.textContent = `Error: ${error.message}`;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Enviar';
  }
});

modeSelect.addEventListener('change', updateModeUI);
updateModeUI();
