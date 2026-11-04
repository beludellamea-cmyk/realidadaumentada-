/**
 * ui.js — Todo lo que se ve fuera de la escena 3D: carga, visor, chip, avisos y errores.
 * Separado de la lógica de RA para poder cambiar textos/estilos sin tocar el tracking.
 */
const $ = (id) => document.getElementById(id);
let temporizadorAviso;

export function ocultarInicio() { $('inicio').hidden = true; }

/** Con la cámara activa se apaga el escenario de la ciudad para que se vea el video. */
function modoCamara(activo) { document.body.classList.toggle('ra-activa', activo); $('btn-salir').hidden = !activo; }

export function mostrarCarga(texto) { $('carga-texto').textContent = texto; $('carga').hidden = false; }
export function ocultarCarga() { $('carga').hidden = true; }

export function mostrarBuscando(visible) {
  $('visor').hidden = !visible;
  if (visible) modoCamara(true);       // primera vez que se llama = la cámara ya está lista
}

/** Chip superior con el nombre de la imagen detectada (o nada si no hay ninguna). */
export function mostrarDetectado(nombre) {
  const chip = $('chip');
  chip.hidden = !nombre;
  if (nombre) chip.textContent = nombre;
}

/** Aviso no bloqueante (ej. falta un archivo de contenido). Desaparece solo. */
export function mostrarAviso(texto, ms = 5000) {
  if (!document.body.classList.contains('ra-activa')) return;   // fuera de la cámara (bienvenida/errores) no se muestran
  const a = $('aviso');
  a.textContent = texto;
  a.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { a.hidden = true; }, ms);
}

/** Error bloqueante: explica qué pasó y cómo arreglarlo. */
export function mostrarError({ titulo, detalle }) {
  ocultarCarga(); ocultarInicio(); $('visor').hidden = true; $('chip').hidden = true; modoCamara(false);
  $('error-titulo').textContent = titulo;
  $('error-detalle').textContent = detalle;
  $('error').hidden = false;
}

export function alReintentar(fn) { $('btn-reintentar').addEventListener('click', fn); }
export function alIniciar(fn) { $('btn-iniciar').addEventListener('click', fn); }

export function alSalir(fn) { $('btn-salir').addEventListener('click', fn); }

/* ---------- Reproductor de video a pantalla completa ---------- */

export function reproductorAbierto() { return !$('reproductor').hidden; }

/** Abre el video a pantalla completa. Intenta con sonido; si el navegador lo impide, arranca en silencio y avisa. */
export function mostrarReproductor(titulo, src) {
  const v = $('rep-video'), nota = $('rep-nota'), espera = $('rep-espera');
  $('rep-titulo').textContent = titulo;
  nota.textContent = '';
  espera.hidden = false;
  $('visor').hidden = true; $('chip').hidden = true;
  $('reproductor').hidden = false;
  v.onplaying = () => { espera.hidden = true; };
  v.onwaiting = () => { espera.hidden = false; };
  v.onerror = () => { espera.hidden = true; nota.textContent = 'No se pudo cargar el video. Revisá tu conexión y volvé a intentar.'; };
  v.muted = false;
  v.src = src;
  v.play().catch(() => {
    v.muted = true;
    nota.textContent = 'Tocá el video para activar el sonido.';
    v.play().catch(() => { espera.hidden = true; });
  });
  v.onvolumechange = () => { if (!v.muted) nota.textContent = ''; };
  $('rep-cerrar').focus({ preventScroll: true });
}

export function cerrarReproductor() {
  const v = $('rep-video');
  v.pause(); v.removeAttribute('src'); v.load();       // libera memoria y datos
  $('reproductor').hidden = true;
}

export function alCerrarReproductor(fn) { $('rep-cerrar').addEventListener('click', fn); }
