# OpenClaw Web + OpenRouter (modelo gratis)

Web mínima para enviar prompts desde navegador a OpenRouter usando un modelo gratuito.

## 1) Configurar variables

Crea un `.env` (o exporta variables) con:

```bash
export OPENROUTER_API_KEY="tu_api_key"
export OPENROUTER_SITE_URL="http://localhost:3000"
export OPENROUTER_APP_NAME="OpenClaw Web Agent"
export PORT=3000
```

## 2) Ejecutar

```bash
npm run start
```

## 3) Usar

Abre `http://localhost:3000`, escribe tu prompt y pulsa **Enviar**.

## Notas

- No expongas tu API key en frontend.
- Modelo default: `meta-llama/llama-3.1-8b-instruct:free`.
