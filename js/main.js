/**
 * main.js — Orquesta el flujo: inicio -> permiso de cámara -> carga -> búsqueda -> detección.
 */
import { TARGETS } from './config.js';
import { construirEscena } from './scene-builder.js';
import * as ui from './ui.js';
import './escenario.js';                 // dibuja la ciudad futurista del fondo

const escena = document.getElementById('escena');
const sistemaAR = () => escena.systems['mindar-image-system'];
let iniciado = false;

/* ---------- Errores comprensibles ---------- */

const ERRORES = {
  inseguro:   { titulo: 'Falta conexión segura', detalle: 'La cámara solo funciona con HTTPS. Abrí la página desde su dirección https:// (por ejemplo, la de GitHub Pages).' },
  sinCamara:  { titulo: 'Tu navegador no puede usar la cámara', detalle: 'Probá abrir esta página directamente en Chrome (Android) o Safari (iPhone), no desde dentro de otra app.' },
  denegado:   { titulo: 'Permiso de cámara denegado', detalle: 'Habilitá la cámara para este sitio en los ajustes del navegador y tocá "Reintentar".' },
  noHayCam:   { titulo: 'No encontramos una cámara', detalle: 'Conectá o habilitá una cámara y tocá "Reintentar".' },
  ocupada:    { titulo: 'La cámara está en uso', detalle: 'Cerrá otras apps que la estén usando y tocá "Reintentar".' },
  sinMind:    { titulo: 'Faltan las imágenes de la muestra', detalle: 'No se encontró assets/targets/targets.mind. Generalo con tus imágenes (ver README) y subilo al repositorio.' },
  librerias:  { titulo: 'No se pudo cargar la realidad aumentada', detalle: 'Revisá tu conexión a internet y tocá "Reintentar".' },
  generico:   { titulo: 'No pudimos iniciar la RA', detalle: 'Recargá la página y probá de nuevo. Si sigue fallando, probá con otro navegador.' },
  lento:      { titulo: 'La carga tarda demasiado', detalle: 'Revisá tu conexión y tocá "Reintentar".' }
};

function errorDeCamara(e) {
  switch (e?.name) {
    case 'NotAllowedError': case 'SecurityError': return ERRORES.denegado;
    case 'NotFoundError': case 'OverconstrainedError': return ERRORES.noHayCam;
    case 'NotReadableError': case 'AbortError': return ERRORES.ocupada;
    default: return ERRORES.generico;
  }
}

/* ---------- Verificaciones previas ---------- */

/** Pide la cámara una vez para clasificar bien el error; MindAR la vuelve a pedir sin mostrar otro cartel. */
async function probarCamara() {
  const flujo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
  flujo.getTracks().forEach(t => t.stop());
}

/** Comprueba que el .mind exista, para dar un error claro en vez de una pantalla colgada. */
async function verificarMind() {
  const ruta = escena.getAttribute('mindar-image').imageTargetSrc;
  const r = await fetch(ruta, { method: 'HEAD', cache: 'no-store' });
  if (!r.ok) throw new Error('mind');
}

/* ---------- Flujo principal ---------- */

async function iniciar() {
  ui.ocultarInicio();
  ui.mostrarCarga('Preparando…');

  if (!window.isSecureContext) return ui.mostrarError(ERRORES.inseguro);
  if (!navigator.mediaDevices?.getUserMedia) return ui.mostrarError(ERRORES.sinCamara);

  try { await verificarMind(); } catch { return ui.mostrarError(ERRORES.sinMind); }

  ui.mostrarCarga('Esperando permiso de cámara…');
  try { await probarCamara(); } catch (e) { return ui.mostrarError(errorDeCamara(e)); }

  ui.mostrarCarga('Cargando imágenes y contenidos…');
  const vigilante = setTimeout(() => ui.mostrarError(ERRORES.lento), 25000);
  escena.addEventListener('arReady', () => {
    clearTimeout(vigilante);
    iniciado = true;
    ui.ocultarCarga();
    ui.mostrarBuscando(true);
  }, { once: true });
  escena.addEventListener('arError', (e) => {
    clearTimeout(vigilante);
    console.error('MindAR:', e.detail);
    ui.mostrarError(errorDeCamara(e.detail?.error));
  }, { once: true });

  sistemaAR().start();
}

/* ---------- Eventos de detección ---------- */

const visibles = new Set();
escena.addEventListener('targetFound', (e) => {         // el evento sube (bubbles) desde cada ancla
  visibles.add(e.target.dataset.nombre);
  ui.mostrarBuscando(false);
  ui.mostrarDetectado([...visibles].join(' + '));
});
escena.addEventListener('targetLost', (e) => {
  visibles.delete(e.target.dataset.nombre);
  ui.mostrarDetectado([...visibles].join(' + '));
  if (visibles.size === 0) ui.mostrarBuscando(true);
});

/* Ahorro de batería: pausamos la cámara y el tracking cuando la pestaña no está visible. */
document.addEventListener('visibilitychange', () => {
  if (!iniciado) return;
  document.hidden ? sistemaAR().pause() : sistemaAR().unpause();
});

/* ---------- Arranque ---------- */

function preparar() {
  construirEscena(escena, TARGETS);
  ui.alIniciar(iniciar);
}

ui.alReintentar(() => location.reload());   // recargar es lo más fiable tras un error de cámara
ui.alSalir(() => location.reload());        // vuelve a la bienvenida y libera la cámara

if (!window.AFRAME) {
  // Sin A-Frame/MindAR (sin internet, o bloqueados) no hay RA: avisamos en vez de dejar un botón muerto.
  ui.alIniciar(() => ui.mostrarError(ERRORES.librerias));
} else {
  await import('./interactions.js');        // registra el componente "tocable" (necesita AFRAME ya cargado)
  escena.hasLoaded ? preparar() : escena.addEventListener('loaded', preparar, { once: true });
}
