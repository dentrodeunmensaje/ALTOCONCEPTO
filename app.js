const estado = {
  entradas: [],
  bolsa: [],
  iniciada: false,
};

const statusEl = document.getElementById('status');
const contentEl = document.getElementById('content');
const messageEl = document.getElementById('message');
const nombreArtisticoEl = document.getElementById('nombreArtistico');
const altoConceptoEl = document.getElementById('altoConcepto');
const nameEl = document.getElementById('name');

function barajar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function rellenarBolsa() {
  estado.bolsa = barajar(estado.entradas);
}

function actualizarEstado() {
  if (!estado.entradas.length) {
    statusEl.textContent = 'No hay respuestas disponibles';
    return;
  }

  const vistas = estado.entradas.length - estado.bolsa.length;
  statusEl.textContent = `${vistas}/${estado.entradas.length} mostradas en esta ronda`;
}

function mostrarEntrada(entrada) {
  nombreArtisticoEl.textContent = entrada['NOMBRE ARTÍSTICO'] || 'Sin nombre artístico';
  altoConceptoEl.textContent = entrada['ALTO CONCEPTO'] || 'Sin alto concepto';
  nameEl.textContent = entrada['Name'] || 'Sin nombre';

  messageEl.classList.add('hidden');
  contentEl.classList.remove('hidden');
}

function siguienteEntrada() {
  if (!estado.entradas.length) return;

  if (estado.bolsa.length === 0) {
    rellenarBolsa();
  }

  const siguiente = estado.bolsa.pop();
  mostrarEntrada(siguiente);
  estado.iniciada = true;
  actualizarEstado();
}

function normalizarFila(fila) {
  const name = (fila['Name'] || '').trim();
  const nombreArtistico = (fila['NOMBRE ARTÍSTICO'] || '').trim();
  const altoConcepto = (fila['ALTO CONCEPTO'] || '').trim();

  if (!name && !nombreArtistico && !altoConcepto) return null;

  return {
    ...fila,
    'Name': name,
    'NOMBRE ARTÍSTICO': nombreArtistico,
    'ALTO CONCEPTO': altoConcepto,
  };
}

function cargarCSV() {
  Papa.parse('respuestas.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (resultado) => {
      estado.entradas = resultado.data
        .map(normalizarFila)
        .filter(Boolean);

      if (!estado.entradas.length) {
        statusEl.textContent = 'No se encontraron filas válidas en respuestas.csv';
        messageEl.innerHTML = '<p>Revisa que el archivo tenga datos y los encabezados correctos.</p>';
        return;
      }

      rellenarBolsa();
      actualizarEstado();
      messageEl.innerHTML = '<p>Presiona la barra espaciadora para mostrar una entrada aleatoria.</p>';
    },
    error: () => {
      statusEl.textContent = 'Error al cargar respuestas.csv';
      messageEl.innerHTML = '<p>No se pudo abrir el archivo. Verifica que esté en la misma carpeta que este sitio.</p>';
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    siguienteEntrada();
  }
});

cargarCSV();
