# Realidad aumentada · IA El Colorado (MindAR + A-Frame)

> Usa el mismo diseño que Humanos digitales (ciudad futurista, logos de `img/`).
> Una vez publicado en GitHub Pages queda en `https://beludellamea-cmyk.github.io/realidadaumentada-/`.
> `assets/targets/targets.mind` ya está generado con las 10 fotos de `assets/images/` (imagen-01 … imagen-10).
> **Faltan los 10 videos** en `assets/videos/` con estos nombres exactos: `puente-en-construccion.mp4`, `puente.mp4`, `rio.mp4`,
> `gente-de-el-colorado.mp4`, `balsa.mp4`, `acto-en-la-plaza.mp4`, `canoas-en-el-rio.mp4`, `giroldi.mp4`, `canoas-pasando.mp4`, `gente-en-el-puente.mp4`.

App de realidad aumentada web que reconoce de 1 a 3 imágenes con la cámara del celular y superpone contenido digital (modelo 3D, video, texto flotante, tarjeta informativa). Sin build, sin instalar nada: HTML/CSS/JS puro, listo para GitHub Pages.

## Estructura

```
├── index.html              # Escena A-Frame + pantallas (inicio, carga, error)
├── css/styles.css          # Estilos de la interfaz
├── js/
│   ├── config.js           # ← ÚNICO archivo a editar para cambiar contenidos
│   ├── main.js             # Flujo: permiso → carga → búsqueda → detección
│   ├── scene-builder.js    # Crea las entidades 3D desde config.js
│   ├── interactions.js     # Toques: animar, mostrar/ocultar, play/pausa
│   └── ui.js               # Carga, visor, avisos y errores
├── assets/
│   ├── targets/targets.mind   # ← lo generás vos (ver abajo)
│   ├── models/                # .glb
│   ├── videos/                # .mp4
│   └── images/                # tus imágenes originales (opcional, para imprimir/guardar)
└── .nojekyll
```

## 1. Generar `targets.mind`

1. Abrí el compilador oficial: https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. Subí tus imágenes (1 a 3) **en el orden en que querés que sean el target 0, 1, 2**.
3. Tocá **Start** y esperá a que termine (se procesa en tu navegador).
4. Descargá `targets.mind` y guardalo en `assets/targets/targets.mind`.

Formato recomendado: JPG/PNG, mínimo ~800 px del lado largo, sin compresión agresiva.

## 2. Agregar imágenes y contenidos

1. Sumá la imagen nueva a tu lista y **recompilá todo junto** (el .mind se genera con todas las imágenes a la vez). Reemplazá `targets.mind`.
2. Poné tus archivos en `assets/models/` (.glb) o `assets/videos/` (.mp4).
3. Abrí `js/config.js` y agregá un bloque en `TARGETS`, en la misma posición que la imagen en el compilador:

```js
{
  nombre: 'Mi afiche nuevo',
  contenido: [
    { tipo: 'modelo', src: 'assets/models/mi-modelo.glb', posicion: '0 0 0.2', escala: '0.5 0.5 0.5' },
    { tipo: 'tarjeta', titulo: 'Título', detalle: 'Texto de la tarjeta', posicion: '0 0.7 0.05' }
  ]
}
```

4. Si agregaste más de 3 imágenes, no hace falta tocar nada más (MindAR soporta más), pero cada imagen extra cuesta algo de rendimiento.

Coordenadas: el centro de la imagen es `0 0 0`, su ancho vale 1; Y sube, Z sale de la imagen hacia vos. Ajustá `posicion` y `escala` probando en el celular.

Tipos: `modelo`, `video`, `texto`, `tarjeta` (campos documentados en `config.js`).

## 3. Probar en el celular

La cámara exige **HTTPS** (o `localhost`). Lo más simple es publicar en GitHub Pages (paso 4) y abrir la URL en el celu. Para probar local en tu compu:

```bash
python3 -m http.server 8080      # abrir http://localhost:8080
```

Para verlo en el celular antes de publicar, usá un túnel HTTPS (por ejemplo `npx localtunnel --port 8080`).

## 4. Publicar

En GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
Cada vez que agregues `targets.mind`, modelos o videos, subí los cambios al repositorio y esperá 1–2 minutos.
Generá un QR con la URL de arriba para pegarlo junto a tus imágenes. Si no ves los cambios, recargá sin caché (los celulares guardan mucho).

## 5. Recomendaciones para una detección estable

**La imagen**
- Con mucho detalle y contraste local: texturas, bordes, formas variadas. Fotos, ilustraciones complejas y mapas funcionan bien.
- Evitá: fondos lisos, degradados, logos simples, texto grande y poco detallado, patrones repetitivos (grillas, rayas).
- Sin reflejos: papel mate mejor que brillante o plastificado.
- Impresa al menos de ~10 cm de lado; más grande se detecta desde más lejos.
- Probá la imagen en el compilador: si el resultado tiene pocos puntos de interés, elegí otra.

**Al usarla**
- Buena luz pareja, sin sombras fuertes ni luz directa que genere brillo.
- Imagen plana y bien apoyada (no arrugada ni curvada).
- Cámara a 20–60 cm al principio; moverse despacio mientras detecta.
- Distintas imágenes del proyecto deben verse bastante diferentes entre sí.

**Ajuste fino** (atributo `mindar-image` en `index.html`)
- Mucho temblor → bajá `filterMinCF` (ej. `0.0001`).
- Contenido que se retrasa al mover → subí `filterBeta` (ej. `10000`).
- Parpadea al perder el tracking → subí `missTolerance`.
- Querés ver varias imágenes a la vez → subí `maxTrack` (consume más).

## 6. Rendimiento (30–60 FPS en gama media)

- **Modelos .glb**: menos de ~50.000 triángulos, texturas de 1024 px o menos, y comprimidos (Draco/meshopt). Idealmente < 3 MB cada uno.
- **Videos**: MP4 H.264 + AAC, 720p o menos, y cortos.
- Al sacar la pestaña de primer plano se pausa la cámara (ahorra batería).
- Los videos se reproducen solo mientras su imagen está visible.

## Decisiones técnicas

- **MindAR + A-Frame por CDN con versión fija**: no requiere build y es reproducible; sin dependencias que instalar.
- **`config.js` + generador de escena**: agregar contenido es editar datos, no copiar HTML.
- **Inicio con botón (`autoStart: false`)**: iOS exige un gesto del usuario para video y cámara; además permite mostrar nuestras propias pantallas de permiso y error.
- **Prueba previa de cámara**: permite diferenciar "permiso denegado", "sin cámara" y "cámara ocupada" con mensajes claros.
- **`shader: flat` y `antialias: false`**: sin cálculo de luces ni suavizado de bordes; gran ahorro de GPU en celulares modestos.
- **`maxTrack: 1`**: el tracking de una sola imagen es lo más liviano.
- **Animaciones nativas de A-Frame** (`animation`): sin librerías extra. Para animaciones internas del .glb podés sumar `aframe-extras` y su `animation-mixer`.
- **Fallbacks**: si falta un .glb o un video, se avisa y se muestra un reemplazo; la app no se rompe.

## Problemas frecuentes

- **"Falta el archivo de imágenes"**: no está `assets/targets/targets.mind` en el repo/Pages.
- **No pide cámara en iPhone**: abrilo en Safari, no desde el navegador interno de Instagram/WhatsApp.
- **No reconoce la imagen**: revisá el apartado 5 y probá con otra imagen más detallada.
- **Los acentos no se ven en `texto`/`tarjeta`**: la tipografía por defecto de A-Frame tiene cobertura limitada; si pasa, usá una fuente MSDF propia (atributo `font` de `a-text`).
