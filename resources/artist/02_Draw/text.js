import { setDrawMode } from "./base.js";

//#CodeStart


/** 글자를 그립니다 */
export function drawText(x, y, text) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.textAlign = 'left';
    ctx.fillText(text, x, y + 15);
}

/** 글자를 해당 정렬 방식에 맞추어 그립니다. align: "left" or "right" or "center" */
export function drawTextTransformed(x, y, text, align, angle = 0) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.save();
    ctx.textAlign = align;
    ctx.translate(x, y);
    ctx.rotate((-angle * Math.PI) / 180);
    ctx.translate(-x, -y);
    ctx.fillText(text, x, y + window.variables.DRAW_FONT_SIZE / 2);
    ctx.restore();
}

/** 드로우 모드의 폰트를 설정합니다 */
export function drawSetFont(size, font) {
    window.variables.DRAW_FONT_SIZE = size;
    window.variables.DRAW_FONT = font;
}