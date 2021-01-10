import { setDrawMode } from "./base.js";

//#CodeStart

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

/** 사각형을 그립니다 */
export function drawRectangle(x1, y1, x2, y2, fill) {
    if (!fill) {
        const ctx = window.variables.TARGET_CANVAS.getContext('2d');
        setDrawMode(ctx);
        ctx.beginPath();
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
    } else {
        const ctx = window.variables.TARGET_CANVAS.getContext('2d');
        setDrawMode(ctx);
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }
}

/** 동그라미를 그립니다 */
export function drawCircle(x, y, r, fill) {
    if (!fill) {
        const ctx = window.variables.TARGET_CANVAS.getContext('2d');
        setDrawMode(ctx);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
    } else {
        const ctx = window.variables.TARGET_CANVAS.getContext('2d');
        setDrawMode(ctx);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}