const imageInput = document.getElementById('imageInput');
const ocrBtn = document.getElementById('ocrBtn');
const ocrStatus = document.getElementById('ocrStatus');
const equationInput = document.getElementById('equationInput');
const solveBtn = document.getElementById('solveBtn');
const graphBtn = document.getElementById('graphBtn');
const resultBox = document.getElementById('resultBox');

function normalizeEquation(text) {
  return text
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/[–—−]/g, '-')
    .replace(/\*/g, '*')
    .replace(/[xX]/g, 'x')
    .replace(/([^a-zA-Z])÷/g, '$1/')
    .replace(/([0-9])([a-zA-Z])/g, '$1*$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1*$2')
    .replace(/\^\^/g, '^');
}

function extractLinearCoeffs(expr) {
  const node = math.simplify(expr);
  const a = node.evaluate({ x: 1 }) - node.evaluate({ x: 0 });
  const b = node.evaluate({ x: 0 });
  return { a, b };
}

function solveEquation(input) {
  const eq = normalizeEquation(input);

  if (!eq.includes('x')) {
    return 'No detecté variable x. Puedes graficar funciones como sin(x), x^2, etc.';
  }

  const [left, right = '0'] = eq.split('=');
  const expr = `(${left})-(${right})`;

  try {
    const poly = math.simplify(expr).toString();

    // intento cuadrática por muestreo
    const f0 = math.evaluate(poly, { x: 0 });
    const f1 = math.evaluate(poly, { x: 1 });
    const f2 = math.evaluate(poly, { x: 2 });

    const c = f0;
    const a = (f2 - 2 * f1 + f0) / 2;
    const b = f1 - a - c;

    const eps = 1e-9;

    if (Math.abs(a) < eps && Math.abs(b) < eps) {
      return `Ecuación degenerada: ${poly} = 0`;
    }

    if (Math.abs(a) < eps) {
      const root = -c / b;
      return `Ecuación lineal\nForma: ${b.toFixed(5)}x + ${c.toFixed(5)} = 0\nSolución: x = ${root}`;
    }

    const disc = b * b - 4 * a * c;

    if (disc < 0) {
      return `Ecuación cuadrática\nForma: ${a.toFixed(5)}x² + ${b.toFixed(5)}x + ${c.toFixed(5)} = 0\nNo tiene raíces reales (discriminante < 0).`;
    }

    const sqrtD = Math.sqrt(disc);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    return `Ecuación cuadrática\nForma: ${a.toFixed(5)}x² + ${b.toFixed(5)}x + ${c.toFixed(5)} = 0\nDiscriminante: ${disc}\nSoluciones: x1 = ${x1}, x2 = ${x2}`;
  } catch (error) {
    return `No pude resolver automáticamente. Error: ${error.message}`;
  }
}

function graphExpression(raw) {
  const eq = normalizeEquation(raw);
  if (!eq) {
    resultBox.textContent = 'Ingresa una expresión para graficar.';
    return;
  }

  let fn;
  if (eq.includes('=')) {
    const [left, right = '0'] = eq.split('=');
    fn = `(${left})-(${right})`;
  } else {
    fn = eq;
  }

  try {
    functionPlot({
      target: '#plot',
      width: document.getElementById('plot').clientWidth,
      height: 380,
      grid: true,
      xAxis: { domain: [-10, 10] },
      yAxis: { domain: [-10, 10] },
      data: [{ fn, graphType: 'polyline' }]
    });
    resultBox.textContent = `Gráfica generada para: ${fn}`;
  } catch (error) {
    resultBox.textContent = `Error al graficar: ${error.message}`;
  }
}

async function runOcr() {
  const file = imageInput.files?.[0];
  if (!file) {
    ocrStatus.textContent = 'Selecciona una imagen primero.';
    return;
  }

  ocrStatus.textContent = 'Procesando OCR...';

  try {
    const {
      data: { text }
    } = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          ocrStatus.textContent = `OCR: ${(m.progress * 100).toFixed(0)}%`;
        }
      }
    });

    const cleaned = normalizeEquation(text);
    equationInput.value = cleaned;
    ocrStatus.textContent = 'OCR completado. Revisa y edita la ecuación si hace falta.';
  } catch (error) {
    ocrStatus.textContent = `OCR falló: ${error.message}`;
  }
}

ocrBtn.addEventListener('click', runOcr);

solveBtn.addEventListener('click', () => {
  const text = equationInput.value.trim();
  if (!text) {
    resultBox.textContent = 'Ingresa una ecuación primero.';
    return;
  }
  resultBox.textContent = solveEquation(text);
});

graphBtn.addEventListener('click', () => {
  graphExpression(equationInput.value.trim());
});

window.addEventListener('resize', () => {
  const text = equationInput.value.trim();
  if (text) {
    graphExpression(text);
  }
});
