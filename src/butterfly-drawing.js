/** Painted butterfly silhouette; size is the fully open wingspan in pixels. */
export function drawIllustratedButterfly(ctx, b) {
    if (![b.x, b.y, b.size].every(Number.isFinite) || b.size <= 0) return;
    const spread = 0.12 + Math.abs(Math.sin(b.flapPhase || 0)) * 0.88;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate((b.heading ?? -Math.PI / 2) + Math.PI / 2);
    ctx.scale(b.size / 2.2, b.size / 2.2);
    ctx.globalAlpha *= b.alpha ?? 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const paint = (points, fill, stroke, width = 0.025) => {
        ctx.beginPath();
        for (const [method, ...args] of points) ctx[method](...args);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
    };
    const dot = (x, y, rx, ry, color) => {
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
    };
    for (const side of [-1, 1]) {
        ctx.save(); ctx.scale(side * spread, 1);
        const upper = ctx.createLinearGradient(0, 0, 1.1, -0.8);
        upper.addColorStop(0, '#504354'); upper.addColorStop(0.26, b.colourUpper || '#d891b4'); upper.addColorStop(1, '#f5dabc');
        const lower = ctx.createLinearGradient(0, 0, 0.9, 0.7);
        lower.addColorStop(0, '#63505d'); lower.addColorStop(0.35, b.colourLower || b.colourUpper || '#bd8fb3'); lower.addColorStop(1, '#e8cbb6');
        paint([['moveTo', 0.045, -0.04], ['bezierCurveTo', 0.3, -0.52, 0.73, -1.02, 1.04, -0.83], ['bezierCurveTo', 1.18, -0.67, 0.91, -0.13, 0.63, 0.03], ['quadraticCurveTo', 0.32, 0.17, 0.045, -0.04], ['closePath']], upper, '#5b4a59', 0.035);
        paint([['moveTo', 0.05, 0], ['bezierCurveTo', 0.52, -0.05, 0.98, 0.2, 0.84, 0.54], ['quadraticCurveTo', 0.74, 0.73, 0.52, 0.68], ['quadraticCurveTo', 0.31, 0.87, 0.15, 0.54], ['quadraticCurveTo', 0.03, 0.28, 0.05, 0], ['closePath']], lower, '#5b4a59', 0.035);
        // Veins fan from the thorax, following the upper and lower wing contours.
        for (const [x, y] of [[1.03, -0.73], [0.93, -0.38], [0.73, -0.08], [0.8, 0.37], [0.61, 0.64], [0.28, 0.67]]) {
            paint([['moveTo', 0.08, 0], ['quadraticCurveTo', x * 0.53, y * 0.8, x, y]], null, 'rgba(78,54,67,0.45)', 0.018);
        }
        for (const [x, y, radius] of [[0.89, -0.66, 0.04], [0.87, -0.47, 0.034], [0.77, -0.29, 0.03], [0.69, 0.38, 0.035], [0.55, 0.54, 0.03], [0.35, 0.55, 0.028]]) dot(x, y, radius, radius * 1.2, '#fff0d5');
        dot(0.48, -0.33, 0.11, 0.14, '#69506c'); dot(0.48, -0.33, 0.058, 0.075, '#e8c68f');
        dot(0.45, 0.34, 0.085, 0.105, 'rgba(90,65,86,0.65)');
        ctx.restore();
    }
    dot(0, 0.16, 0.052, 0.37, '#493f49'); dot(0, -0.12, 0.073, 0.15, '#5c4d56');
    dot(0, -0.31, 0.072, 0.075, '#443a45');
    for (const side of [-1, 1]) {
        paint([['moveTo', side * 0.025, -0.35], ['quadraticCurveTo', side * 0.1, -0.61, side * 0.2, -0.56]], null, '#665362', 0.018);
        dot(side * 0.2, -0.56, 0.02, 0.025, '#d6b391');
    }
    ctx.restore();
}
