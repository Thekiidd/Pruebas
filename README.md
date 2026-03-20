# MathSnap Free (Demo para clase)

Proyecto web **100% gratis** para:
- Subir una foto de una ecuación y transcribirla con OCR.
- Resolver ecuaciones lineales/cuadráticas básicas.
- Graficar funciones o ecuaciones transformadas a `f(x)=0`.

## Tecnologías gratis usadas
- [Tesseract.js](https://github.com/naptha/tesseract.js) para OCR en navegador.
- [Math.js](https://mathjs.org/) para evaluar/simplificar expresiones.
- [function-plot](https://github.com/mauriciopoppe/function-plot) para gráficas.

---

## Comandos para correrlo localmente

### Opción A: servidor con Python (recomendado)
```bash
cd /ruta/a/tu/proyecto
python3 -m http.server 8000
```
Luego abre: `http://localhost:8000`

### Opción B: abrir directo el HTML
```bash
cd /ruta/a/tu/proyecto
xdg-open index.html
```
> En algunos sistemas no existe `xdg-open`; puedes abrir `index.html` manualmente con doble clic.

---

## Comandos para subirlo y correrlo en GitHub Pages

> Estos comandos asumen que aún no has subido el proyecto a GitHub.

### 1) Inicializar git y subir al repo
```bash
cd /ruta/a/tu/proyecto
git init
git add .
git commit -m "Primer commit: MathSnap Free"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 2) Activar GitHub Pages desde la rama `main`
No requiere build porque este proyecto es HTML/CSS/JS estático.

1. Ve a tu repo en GitHub.
2. Entra a **Settings** → **Pages**.
3. En **Source**, selecciona:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** (root)
4. Guarda.

### 3) URL final
GitHub Pages te dará una URL tipo:

```text
https://TU_USUARIO.github.io/TU_REPO/
```

### 4) Publicar cambios nuevos
Cada vez que cambies algo:
```bash
git add .
git commit -m "Actualizar app"
git push
```
GitHub Pages actualizará el sitio automáticamente.

---

## Estructura del proyecto
```text
.
├── index.html
├── app.js
├── style.css
└── README.md
```

## Notas
- El OCR de Tesseract no está especializado en notación matemática compleja, así que se recomienda corregir manualmente la ecuación detectada.
- Este MVP está orientado a demostración en clase y puede ampliarse a un backend con SymPy en una fase siguiente.
