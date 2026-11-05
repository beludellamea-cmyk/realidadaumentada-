/**
 * config.js — LAS FOTOS Y SUS VIDEOS. Es el único archivo que hay que editar para cambiar contenidos.
 *
 * El orden de esta lista TIENE que coincidir con el orden de las imágenes con que se generó
 * assets/targets/targets.mind (la 1.ª foto es imagen-01.jpg, la 2.ª imagen-02.jpg, etc.).
 *
 *   nombre : lo que se lee arriba del video
 *   imagen : la foto original (assets/images/…), por si hay que imprimirla de nuevo
 *   video  : archivo en assets/videos/…  — o null si todavía no tiene (muestra "Muy pronto")
 */
export const FOTOS = [
  { nombre: 'Puente en construcción', imagen: 'assets/images/imagen-01.jpg', video: 'assets/videos/puente-en-construccion.mp4' },
  { nombre: 'Puente',                 imagen: 'assets/images/imagen-02.jpg', video: 'assets/videos/puente.mp4' },
  { nombre: 'Pasarela colgante',      imagen: 'assets/images/imagen-03.jpg', video: null },
  { nombre: 'Gente de El Colorado',   imagen: 'assets/images/imagen-04.jpg', video: 'assets/videos/gente-de-el-colorado.mp4' },
  { nombre: 'Balsa',                  imagen: 'assets/images/imagen-05.jpg', video: 'assets/videos/balsa.mp4' },
  { nombre: 'Acto en la plaza',       imagen: 'assets/images/imagen-06.jpg', video: 'assets/videos/acto-en-la-plaza.mp4' },
  { nombre: 'Canoas en el río',       imagen: 'assets/images/imagen-07.jpg', video: 'assets/videos/canoas-en-el-rio.mp4' },   // también hay: canoas-pasando.mp4 y rio.mp4
  { nombre: 'Giroldi',                imagen: 'assets/images/imagen-08.jpg', video: 'assets/videos/giroldi.mp4' },
  { nombre: 'Puente sobre el río',    imagen: 'assets/images/imagen-09.jpg', video: null },
  { nombre: 'Gente en el puente',     imagen: 'assets/images/imagen-10.jpg', video: 'assets/videos/gente-en-el-puente.mp4' }
];
