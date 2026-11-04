/**
 * config.js — EL ÚNICO ARCHIVO QUE EDITÁS PARA CAMBIAR CONTENIDOS.
 *
 * El orden de TARGETS coincide con el orden de las imágenes con que se generó
 * assets/targets/targets.mind: la 1.ª imagen es targetIndex 0, etc.
 * (Las imágenes originales están en assets/images/imagen-01.jpg … imagen-10.jpg.)
 *
 * Sistema de coordenadas (por imagen): el centro de la imagen es "0 0 0";
 * el ancho de la imagen vale 1 unidad. X: -0.5 (izq) a 0.5 (der) · Y: arriba (+) / abajo (-) ·
 * Z: hacia afuera de la imagen (hacia vos).
 *
 * Tipos de contenido disponibles:
 *   modelo  -> { src, posicion, escala, rotacion }       (.glb)
 *   video   -> { src, ancho, posicion }                  (.mp4 H.264 + AAC)
 *   texto   -> { valor, posicion, ancho, color }
 *   tarjeta -> { titulo, detalle, posicion }             (tocar la tarjeta muestra/oculta el detalle)
 */

/** Cada foto muestra su video encima (el primer toque activa el sonido). */
const conVideo = (nombre, archivo) => ({
  nombre,
  contenido: [{ tipo: 'video', src: `assets/videos/${archivo}.mp4`, ancho: 1, posicion: '0 0 0.02' }]
});

export const TARGETS = [
  conVideo('Puente en construcción', 'puente-en-construccion'),   // imagen-01
  conVideo('Puente',                 'puente'),                   // imagen-02
  conVideo('Río',                    'rio'),                      // imagen-03
  conVideo('Gente de El Colorado',   'gente-de-el-colorado'),     // imagen-04
  conVideo('Balsa',                  'balsa'),                    // imagen-05
  conVideo('Acto en la plaza',       'acto-en-la-plaza'),         // imagen-06
  conVideo('Canoas en el río',       'canoas-en-el-rio'),         // imagen-07
  conVideo('Giroldi',                'giroldi'),                  // imagen-08
  conVideo('Canoas pasando',         'canoas-pasando'),           // imagen-09
  conVideo('Gente en el puente',     'gente-en-el-puente')        // imagen-10
];
