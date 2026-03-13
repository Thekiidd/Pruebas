# OpenClaw Web + OpenRouter (modelo gratis)

Esta app ahora soporta **2 modos**:

1. **Backend seguro (Node.js):** recomendado para producción.
2. **Cliente directo (estático / GitHub Pages):** funciona sin servidor, pero tu API key se usa en navegador.

## Estructura de archivos (en raíz)

- `index.html`
- `styles.css`
- `app.js`
- `server.js`

> Así sí vas a ver el `index` y `styles` directamente en tu repo, sin entrar a carpeta `public`.

## ¿En GitHub Pages funciona?

Sí, pero con una limitación importante: GitHub Pages solo sirve archivos estáticos, así que **no puede ejecutar `server.js`** ni proteger secretos en backend.

- Si publicas en Pages, usa el modo **Cliente directo**.
- Si quieres seguridad real de API key, despliega backend (Render, Railway, Fly, VPS, etc.) y usa modo **Backend**.

## 1) Ejecutar en local con backend (seguro)

Configura variables:

```bash
export OPENROUTER_API_KEY="tu_api_key"
export OPENROUTER_SITE_URL="http://localhost:3000"
export OPENROUTER_APP_NAME="OpenClaw Web Agent"
export PORT=3000
```

Luego ejecuta:

```bash
npm run start
```

Abre `http://localhost:3000`.

## 2) Publicar en GitHub Pages (estático)

Ya se incluyó workflow automático en `.github/workflows/deploy-pages.yml`.

Pasos:

1. Sube este repo a GitHub.
2. En GitHub, entra a **Settings → Pages** y selecciona **GitHub Actions** como source.
3. Haz push a `main` (o ejecuta el workflow manualmente si lo adaptas).
4. En la web publicada, selecciona **Modo cliente** (o Auto con key) y pega tu API key para probar.

## Seguridad

- **Nunca** hardcodees la API key en `app.js` o `index.html`.
- Si compartiste una key en público, revócala y genera otra.
