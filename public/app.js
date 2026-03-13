const sendBtn = document.getElementById('sendBtn');
const promptInput = document.getElementById('prompt');
const modelInput = document.getElementById('model');
const resultBox = document.getElementById('result');

sendBtn.addEventListener('click', async () => {
  const message = promptInput.value.trim();
  const model = modelInput.value.trim();

  if (!message) {
    resultBox.textContent = 'Escribe un mensaje antes de enviar.';
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Consultando...';
  resultBox.textContent = 'Generando respuesta...';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, model })
    });

    const data = await response.json();

    if (!response.ok) {
      resultBox.textContent = `Error: ${data.error || 'No se pudo obtener respuesta.'}`;
      return;
    }

    resultBox.textContent = data.reply;
  } catch (error) {
    resultBox.textContent = `Fallo de red: ${error.message}`;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Enviar';
  }
});
