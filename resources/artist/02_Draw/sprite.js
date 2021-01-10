import { setDrawMode } from "./base.js";

//#CodeStart

/** 이미지를 불러옵니다 */
export function spriteLoad(dir, sprite_name) {
    let img = new Image();
    img.src = dir;

    window.variables.SPRITE[sprite_name] = img;
}

export function spriteGetWidth(sprite_name) {
    return window.variables.SPRITE[sprite_name].width;
}
export function spriteGetHeight(sprite_name) {
    return window.variables.SPRITE[sprite_name].height;
}

/** 불러온 이미지를 그립니다 */
export function drawSprite(x, y, sprite_name) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.drawImage(window.variables.SPRITE[sprite_name], x, y, window.variables.SPRITE[sprite_name].width, window.variables.SPRITE[sprite_name].height);
}

/** 해당 이미지를 해당 정렬 방식과 사이즈에 맞추어 그립니다 */
export function drawSpriteExt(x, y, sprite_name, align, xscale, yscale, angle) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.translate(x, y);
    ctx.rotate((-angle * Math.PI) / 180);
    ctx.translate(-x, -y);
    if (align == 'center') {
        x += xscale < 0 ? (window.variables.SPRITE[sprite_name].width * xscale) / 2 : -(window.variables.SPRITE[sprite_name].width * xscale) / 2;
        y += yscale < 0 ? (window.variables.SPRITE[sprite_name].height * yscale) / 2 : -(window.variables.SPRITE[sprite_name].height * yscale) / 2;
    }
    ctx.translate(x - (xscale < 0 ? window.variables.SPRITE[sprite_name].width * xscale : 0), y - (yscale < 0 ? window.variables.SPRITE[sprite_name].height * yscale : 0));
    ctx.scale(xscale, yscale);
    ctx.drawImage(window.variables.SPRITE[sprite_name], 0, 0, window.variables.SPRITE[sprite_name].width, window.variables.SPRITE[sprite_name].height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
}

