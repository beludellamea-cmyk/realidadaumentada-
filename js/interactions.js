/**
 * interactions.js — Componente A-Frame "tocable".
 * Uso:  tocable="accion: animar | alternar | video"
 * Los toques llegan como evento 'click' gracias al raycaster de la cámara (ver index.html).
 */
const ACCIONES = {
  /** Gira el objeto 360° con un saltito. Ignora toques mientras dura la animación. */
  animar() {
    if (this.ocupado) return;
    this.ocupado = true;
    const el = this.el;
    const r = el.getAttribute('rotation');
    const p = el.getAttribute('position');
    el.setAttribute('animation__giro', {
      property: 'rotation', from: `${r.x} ${r.y} ${r.z}`, to: `${r.x} ${r.y + 360} ${r.z}`, dur: 900, easing: 'easeInOutQuad'
    });
    el.setAttribute('animation__salto', {
      property: 'position', from: `${p.x} ${p.y} ${p.z}`, to: `${p.x} ${p.y + 0.1} ${p.z}`, dur: 220, dir: 'alternate', loop: 1, easing: 'easeOutQuad'
    });
    setTimeout(() => { this.ocupado = false; }, 950);
  },

  /** Muestra u oculta el objeto asociado (el texto de detalle de la tarjeta). */
  alternar() {
    const destino = this.el.objetivo;
    if (destino) destino.setAttribute('visible', !destino.getAttribute('visible'));
  },

  /** Video: el primer toque activa el sonido (permitido porque es un gesto del usuario); luego play/pausa. */
  video() {
    const v = this.el.videoEl;
    if (!v) return;
    if (v.muted) { v.muted = false; v.play().catch(() => {}); return; }
    v.paused ? v.play().catch(() => {}) : v.pause();
  }
};

AFRAME.registerComponent('tocable', {
  schema: { accion: { type: 'string', default: 'animar' } },
  init() {
    this.ocupado = false;
    this.el.addEventListener('click', () => {
      navigator.vibrate?.(15);                 // respuesta háptica (Android; iOS la ignora)
      ACCIONES[this.data.accion]?.call(this);
    });
  }
});
