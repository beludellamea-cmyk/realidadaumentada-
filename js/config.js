/**
 * config.js — EL ÚNICO ARCHIVO QUE EDITÁS PARA CAMBIAR CONTENIDOS.
 *
 * El orden de TARGETS debe coincidir con el orden de las imágenes que
 * subiste al compilador de MindAR: la 1.ª imagen es targetIndex 0, etc.
 *
 * Sistema de coordenadas (por imagen): el centro de la imagen es "0 0 0";
 * el ancho de la imagen vale 1 unidad. X: -0.5 (izq) a 0.5 (der) · Y: arriba (+) / abajo (-) ·
 * Z: hacia afuera de la imagen (hacia vos). Ej.: "0 0.6 0.05" = centrado, sobre el borde superior, apenas despegado.
 *
 * Tipos de contenido disponibles:
 *   modelo  -> { src, posicion, escala, rotacion }       (.glb)
 *   video   -> { src, ancho, posicion }                  (.mp4 H.264 + AAC)
 *   texto   -> { valor, posicion, ancho, color }
 *   tarjeta -> { titulo, detalle, posicion }             (tocar la tarjeta muestra/oculta el detalle)
 */
export const TARGETS = [
  {
    nombre: 'Afiche',
    contenido: [
      { tipo: 'modelo', src: 'assets/models/modelo1.glb', posicion: '0 -0.1 0.2', escala: '0.5 0.5 0.5' },
      { tipo: 'tarjeta', titulo: 'Modelo 3D', detalle: 'Tocá el objeto para hacerlo girar.\nTocá esta tarjeta para ocultar el detalle.', posicion: '0 0.7 0.05' }
    ]
  },
  {
    nombre: 'Tarjeta con video',
    contenido: [
      { tipo: 'video', src: 'assets/videos/video1.mp4', ancho: 1, posicion: '0 0 0.02' }
    ]
  },
  {
    nombre: 'Página del libro',
    contenido: [
      { tipo: 'texto', valor: 'Texto flotante', posicion: '0 0.45 0.15', ancho: 1.6, color: '#F2B632' },
      { tipo: 'tarjeta', titulo: 'Dato curioso', detalle: 'Acá va la información\nde esta página.', posicion: '0 -0.55 0.05' }
    ]
  }
];
