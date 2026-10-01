export function drawTickerStrip(ctx, p) {
  if (![p.x, p.y, p.width, p.height].every(Number.isFinite) || p.width <= 0 || p.height <= 0 || p.alpha <= 0) return;
  const face = Math.cos(p.flipPhase || 0);
  const width = p.width * (0.12 + Math.abs(face) * 0.88);
  const curl = Math.sin(p.curlPhase || 0) * p.width * 0.32;
  const top = -p.height / 2, bottom = p.height / 2;
  ctx.save();
  ctx.globalAlpha *= p.alpha ?? 1;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation || 0);
  ctx.beginPath();
  ctx.moveTo(-width / 2, top);
  ctx.bezierCurveTo(-width / 2 + curl, top + p.height * 0.3, -width / 2 - curl, bottom - p.height * 0.3, -width / 2, bottom);
  ctx.lineTo(width / 2, bottom);
  ctx.bezierCurveTo(width / 2 - curl, bottom - p.height * 0.3, width / 2 + curl, top + p.height * 0.3, width / 2, top);
  ctx.closePath();
  ctx.fillStyle = p.colour;
  ctx.fill();
  const shade = ctx.createLinearGradient(-width / 2, top, width / 2, bottom);
  shade.addColorStop(0, face < 0 ? "rgba(20,25,40,0.28)" : "rgba(255,255,255,0.48)");
  shade.addColorStop(0.42, "rgba(255,255,255,0.05)");
  shade.addColorStop(0.7, "rgba(20,25,40,0.2)");
  shade.addColorStop(1, "rgba(255,255,255,0.3)");
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(width / 2, top);
  ctx.bezierCurveTo(width / 2 + curl, top + p.height * 0.3, width / 2 - curl, bottom - p.height * 0.3, width / 2, bottom);
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 0.55;
  ctx.stroke();
  ctx.restore();
}
export function advanceTickerStrip(p, height, opts, frames) {
  const oldSway = Math.cos(p.swayPhase);
  p.swayPhase += p.swayFreq * frames;
  p.x += p.vx * frames + (oldSway - Math.cos(p.swayPhase)) * opts.sway;
  p.y += p.vy * frames;
  p.rotation += p.rotationSpeed * frames;
  p.flipPhase += p.flipSpeed * frames;
  p.curlPhase += 0.025 * frames;
  const progress = p.y / Math.max(1, height);
  p.alpha = progress < opts.fadeStart ? 1 : Math.max(0, 1 - (progress - opts.fadeStart) / Math.max(1e-3, 1 - opts.fadeStart));
  if (p.y - p.height > height || p.alpha <= 0.01) p.alive = false;
}

