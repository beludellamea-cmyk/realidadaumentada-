/**
 * scene-builder.js — Convierte config.js en entidades A-Frame.
 * Decisión: generar el DOM desde datos evita copiar/pegar HTML al sumar imágenes.
 */
import { mostrarAviso } from './ui.js';

/** Crea un elemento A-Frame y le aplica atributos. */
function crear(tag, attrs = {}) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/** "0 0.5 0" -> {x, y, z} */
function vec(str = '0 0 0') {
  const [x, y, z] = str.split(/\s+/).map(Number);
  return { x, y, z };
}

/** Animación de "aparición" (escala de 0 al valor final), disparada al detectar la imagen. */
function conAparicion(el, escalaFinal) {
  el.classList.add('aparece');
  el.setAttribute('animation__aparecer', {
    property: 'scale', from: '0 0 0', to: escalaFinal, dur: 450, easing: 'easeOutBack', startEvents: 'aparecer'
  });
}

/* ---------- Creadores por tipo de contenido ---------- */

function crearModelo(c) {
  const escala = c.escala ?? '0.5 0.5 0.5';
  const el = crear('a-entity', {
    'gltf-model': c.src,
    position: c.posicion ?? '0 0 0.1',
    rotation: c.rotacion ?? '0 0 0',
    scale: escala,
    class: 'clickable',
    tocable: 'accion: animar'
  });
  conAparicion(el, escala);
  // Si el .glb no existe o está dañado, mostramos un cubo y avisamos (la app sigue funcionando).
  el.addEventListener('model-error', () => {
    el.removeAttribute('gltf-model');
    el.setAttribute('geometry', 'primitive: box; width: 0.5; height: 0.5; depth: 0.5');
    el.setAttribute('material', 'color: #F2B632');
    mostrarAviso(`No se pudo cargar el modelo: ${c.src}`);
  });
  return el;
}

function crearVideo(c, ancla) {
  const video = document.createElement('video');
  video.src = c.src;
  video.loop = true;
  video.muted = true;               // arranca en silencio: los navegadores bloquean autoplay con sonido
  video.playsInline = true;         // evita que iOS lo abra a pantalla completa
  video.setAttribute('webkit-playsinline', '');
  video.preload = 'metadata';       // no descarga todo hasta que haga falta (ahorra datos y memoria)
  document.getElementById('medios').appendChild(video);
  ancla.videos.push(video);

  const ancho = c.ancho ?? 1;
  const plano = crear('a-plane', { width: ancho, height: ancho * 9 / 16, position: c.posicion ?? '0 0 0.02', class: 'clickable', tocable: 'accion: video' });
  plano.setAttribute('material', { shader: 'flat', src: video }); // 'flat' = sin cálculo de luces, más liviano
  plano.videoEl = video;
  conAparicion(plano, '1 1 1');
  video.addEventListener('error', () => {
    plano.setAttribute('material', { shader: 'flat', src: '', color: '#333333' });
    mostrarAviso(`No se pudo cargar el video: ${c.src}`);
  });
  return plano;
}

function crearTexto(c) {
  const pos = vec(c.posicion ?? '0 0.4 0.1');
  const el = crear('a-text', {
    value: c.valor, align: 'center', width: c.ancho ?? 1.6, color: c.color ?? '#FFFFFF',
    'wrap-count': 24, position: `${pos.x} ${pos.y} ${pos.z}`
  });
  // Flotación suave (solo posición: casi no cuesta rendimiento)
  el.setAttribute('animation__flotar', {
    property: 'position', to: `${pos.x} ${pos.y + 0.05} ${pos.z}`, dir: 'alternate', dur: 1400, loop: true, easing: 'easeInOutSine'
  });
  conAparicion(el, '1 1 1');
  return el;
}

function crearTarjeta(c) {
  const grupo = crear('a-entity', { position: c.posicion ?? '0 0.6 0.05' });
  const fondo = crear('a-plane', { width: 1, height: 0.5, class: 'clickable', tocable: 'accion: alternar' });
  fondo.setAttribute('material', 'shader: flat; color: #0B3B39; opacity: 0.92; transparent: true');
  const titulo = crear('a-text', { value: c.titulo, anchor: 'left', align: 'left', baseline: 'top', width: 0.9, color: '#F2B632', position: '-0.45 0.2 0.01', 'wrap-count': 26 });
  const detalle = crear('a-text', { value: c.detalle ?? '', anchor: 'left', align: 'left', baseline: 'top', width: 0.8, color: '#EAF4F2', position: '-0.45 0.08 0.01', 'wrap-count': 30 });
  fondo.objetivo = detalle;         // el componente "tocable" mostrará/ocultará este texto
  grupo.append(fondo, titulo, detalle);
  conAparicion(grupo, '1 1 1');
  return grupo;
}

const CREADORES = { modelo: crearModelo, video: crearVideo, texto: crearTexto, tarjeta: crearTarjeta };

/* ---------- Construcción de la escena ---------- */

export function construirEscena(escena, targets) {
  targets.forEach((t, indice) => {
    // Un "ancla" por imagen: MindAR la muestra/oculta y la mueve según el tracking.
    const ancla = crear('a-entity', { 'mindar-image-target': `targetIndex: ${indice}` });
    ancla.dataset.nombre = t.nombre;
    ancla.videos = [];

    for (const c of t.contenido) {
      const crearFn = CREADORES[c.tipo];
      if (!crearFn) { console.warn(`Tipo de contenido desconocido: "${c.tipo}"`); continue; }
      ancla.appendChild(crearFn(c, ancla));
    }

    ancla.addEventListener('targetFound', () => {
      ancla.querySelectorAll('.aparece').forEach(el => el.emit('aparecer'));
      ancla.videos.forEach(v => v.play().catch(() => {}));   // reproduce solo mientras se ve la imagen
    });
    ancla.addEventListener('targetLost', () => ancla.videos.forEach(v => v.pause()));

    escena.appendChild(ancla);
  });
}
