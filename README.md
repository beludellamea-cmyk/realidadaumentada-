# Realidad aumentada · IA El Colorado

Página web de realidad aumentada para la Expo de Ciencias 2026. Se abre en el celular o la tablet, se activa la cámara y, al apuntar el **lente** a una de las fotos impresas, se abre su video a pantalla completa.

Dirección (con GitHub Pages activado): `https://beludellamea-cmyk.github.io/realidadaumentada-/`

## Cómo se usa
1. Abrir la página en Chrome (Android) o Safari (iPhone) — no desde WhatsApp ni Instagram.
2. Tocar **Abrir el lente** y permitir la cámara.
3. Apuntar a una foto impresa con buena luz, a unos 20–60 cm. El lente la reconoce y abre el video.
4. **✕ Cerrar** vuelve al lente para buscar otra foto. **✕ Salir** vuelve a la bienvenida.

## Archivos
```
index.html            la página (diseño, lente, cámara y reproductor)
estilos.css           estilos (ciudad futurista, lente, reproductor)
config.js             ← lista de fotos y sus videos (lo único que se edita)
assets/images/        las 10 fotos originales (para imprimir)
assets/videos/        los videos
assets/targets/       targets.mind: "huella" de las fotos para reconocerlas
lib/                  MindAR (reconocimiento de imágenes, licencia MIT)
img/                  logos
```

## Cambiar o agregar un video
- Copiar el video (MP4, H.264 + AAC, 720p o menos) en `assets/videos/` y poner su ruta en `config.js` (`video: 'assets/videos/nombre.mp4'`).
- Las fotos 3 (pasarela colgante) y 9 (puente sobre el río) no tienen video todavía y muestran "Muy pronto".
- Sobran dos videos de canoas (`canoas-pasando.mp4`, `rio.mp4`), de la misma foto que `canoas-en-el-rio.mp4`.

## Agregar o cambiar una foto
`targets.mind` se genera con **todas** las fotos juntas, en el orden de `config.js`. Hay que volver a generarlo con el compilador oficial (https://hiukim.github.io/mind-ar-js-doc/tools/compile), subiendo las fotos en ese orden, y reemplazar `assets/targets/targets.mind`.

## Consejos para que reconozca bien
- Fotos impresas mate (sin brillo), planas y de al menos ~10 cm de lado.
- Luz pareja, sin reflejos ni sombras fuertes.
- Fotos bien distintas entre sí. Si el celular confunde dos fotos, acercarse más.
- Si no se ven los cambios después de subir archivos, recargar sin caché.
