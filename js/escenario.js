/**
 * escenario.js — Dibuja la ciudad futurista del fondo (misma que el sitio Humanos digitales).
 * Es decoración pura: genera un SVG con edificios y ventanas a partir de una semilla fija.
 */
function ciudad(id, semilla, colores, altMin, altMax) {
  let s = semilla;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const W = 1600, H = 400;
  let x = -20, out = '';
  while (x < W + 20) {
    const w = 40 + rnd() * 70, h = altMin + rnd() * (altMax - altMin), y = H - h;
    const c = colores[Math.floor(rnd() * colores.length)];
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    if (rnd() > .72) out += `<rect x="${x + w / 2 - 2}" y="${y - 38}" width="4" height="38" fill="${c}"/><circle cx="${x + w / 2}" cy="${y - 40}" r="3" fill="#ff7a59"/>`;
    if (rnd() > .8) out += `<rect x="${x}" y="${y}" width="${w}" height="4" fill="#3fd1b5" opacity=".8"/>`;
    for (let wy = y + 14; wy < H - 10; wy += 18)
      for (let wx = x + 8; wx < x + w - 8; wx += 14)
        if (rnd() > .6) out += `<rect x="${wx}" y="${wy}" width="6" height="8" fill="${rnd() > .55 ? '#3fd1b5' : '#f0a63a'}" opacity="${(.55 + rnd() * .45).toFixed(2)}"/>`;
    x += w + 4 + rnd() * 10;
  }
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">${out}</svg>`;
}

ciudad('ciudadLejos', 7,  ['#1c3a40', '#214248', '#183238'], 120, 300);
ciudad('ciudadCerca', 42, ['#3a2a2a', '#432f2d', '#2f2323'], 70, 230);
