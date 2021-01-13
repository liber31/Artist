import { setDrawMode } from "./base.js";

//#CodeStart

export class Shape {
	constructor(x, y) {
		this.ctx = window.variables.TARGET_CANVAS.getContext('2d');
		this.x = x;
		this.y = y;
	}

	start() {
		setDrawMode(this.ctx);
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		return this;
	}

	line(x, y) {
		this.ctx.lineTo(x, y);
		return this;
	}

	quadraticLine(x, y, targetX, targetY) {
		this.ctx.quadraticCurveTo(targetX, targetY, x, y);
		return this;
	}

	bezierLine(x, y, targetX1, targetY1, targetX2, targetY2) {
		this.ctx.bezierCurveTo(targetX1, targetY1, targetX2, targetY2, x, y);
		return this;
	}

	fill() {
		this.ctx.fill();
		return this;
	}

	stroke() {
		this.ctx.stroke();
		return this;
	}

	move(x, y) {
		this.ctx.moveTo(x, y);
		return this;
	}
}

/** 선을 그립니다 */
export function drawLine(x1, y1, x2, y2) {
	const ctx = window.variables.TARGET_CANVAS.getContext('2d');
	setDrawMode(ctx);
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

/** 해당 두께의 선을 그립니다 */
export function drawLineThick(x1, y1, x2, y2, width) {
	const ctx = window.variables.TARGET_CANVAS.getContext('2d');
	setDrawMode(ctx);
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineWidth = width;
	ctx.stroke();
}

export function drawTriangle(x1, y1, x2, y2, x3, y3, fill) {
	const ctx = window.variables.TARGET_CANVAS.getContext('2d');
	setDrawMode(ctx);
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	if (!fill) {
		ctx.lineTo(x1, y1);
		ctx.stroke();
	} else {
		ctx.fill();
	}
}

/** 사각형을 그립니다 */
export function drawRectangle(x1, y1, x2, y2, fill) {
	const ctx = window.variables.TARGET_CANVAS.getContext('2d');
	if (!fill) {
		setDrawMode(ctx);
		ctx.beginPath();
		ctx.rect(x1, y1, x2 - x1, y2 - y1);
		ctx.stroke();
	} else {
		setDrawMode(ctx);
		ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
	}
}

/** 동그라미를 그립니다 */
export function drawCircle(x, y, r, fill) {
	const ctx = window.variables.TARGET_CANVAS.getContext('2d');
	if (!fill) {
		setDrawMode(ctx);
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.stroke();
	} else {
		setDrawMode(ctx);
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}