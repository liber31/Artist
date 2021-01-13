//#CodeStart

export function drawSetAlpha(alpha) {
	window.variables.DRAW_ALPHA = Math.min(1, alpha);
}

export function drawSetColor(color) {
	window.variables.DRAW_COLOR = color;
}

export function drawSetFilter(filter) {
	window.variables.DRAW_FILTER = filter;
}

/** ctx를 받고, 현재 캔버스의 설정을 입력합니다 */
export function setDrawMode(ctx) {
	ctx.restore();
	ctx.scale(1, 1);
	ctx.font = `${window.variables.DRAW_FONT_SIZE}px ${window.variables.DRAW_FONT}`;
	ctx.lineWidth = 1;
	ctx.globalAlpha = window.variables.DRAW_ALPHA;
	ctx.fillStyle = window.variables.DRAW_COLOR;
	ctx.strokeStyle = window.variables.DRAW_COLOR;
	ctx.filter = window.variables.DRAW_FILTER;
}