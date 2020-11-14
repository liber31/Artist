//#CodeStart
export const color = {
    black: 'black',
    green: 'green',
    red: 'red',
    white: 'white',
    gray: 'gray',
    yellow: 'yellow',
};

/** 사각형을 그립니다 */
export function draw_rectangle(x1, y1, x2, y2, fill) {
    if (!fill) {
        const ctx = window.variables.canvas.getContext('2d');
        setDrawMode(ctx);
        ctx.beginPath();
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
    } else {
        const ctx = window.variables.canvas.getContext('2d');
        setDrawMode(ctx);
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }
}

/** 동그라미를 그립니다 */
export function draw_circle(x, y, r, fill) {
    if (!fill) {
        const ctx = window.variables.canvas.getContext('2d');
        setDrawMode(ctx);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
    } else {
        const ctx = window.variables.canvas.getContext('2d');
        setDrawMode(ctx);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

/** 글자를 그립니다 */
export function draw_text(x, y, text) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.textAlign = 'left';
    ctx.fillText(text, x, y + 15);
}

/** 글자를 해당 정렬 방식에 맞추어 그립니다. align: "left" or "right" or "center" */
export function draw_text_transformed(x, y, text, align, angle = 0) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.save();
    ctx.textAlign = align;
    ctx.translate(x, y);
    ctx.rotate((-angle * Math.PI) / 180);
    ctx.translate(-x, -y);
    ctx.fillText(text, x, y + window.variables.draw_font_size / 2);
    ctx.restore();
}

/** 선을 그립니다 */
export function draw_line(x1, y1, x2, y2) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/** 해당 두께의 선을 그립니다 */
export function draw_line_width(x1, y1, x2, y2, width) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width;
    ctx.stroke();
}

/** 이미지를 불러옵니다 */
export function sprite_load(dir, sprite_name) {
    let img = new Image();
    img.src = dir;

    window.variables.sprite[sprite_name] = img;
}

export function sprite_get_width(sprite_name) {
    return window.variables.sprite[sprite_name].width;
}
export function sprite_get_height(sprite_name) {
    return window.variables.sprite[sprite_name].height;
}

/** 불러온 이미지를 그립니다 */
export function draw_sprite(x, y, sprite_name) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.drawImage(window.variables.sprite[sprite_name], x, y, window.variables.sprite[sprite_name].width, window.variables.sprite[sprite_name].height);
}

/** 해당 이미지를 해당 정렬 방식과 사이즈에 맞추어 그립니다 */
export function draw_sprite_ext(x, y, sprite_name, align, xscale, yscale, angle) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.translate(x, y);
    ctx.rotate((-angle * Math.PI) / 180);
    ctx.translate(-x, -y);
    if (align == 'center') {
        x += xscale < 0 ? (window.variables.sprite[sprite_name].width * xscale) / 2 : -(window.variables.sprite[sprite_name].width * xscale) / 2;
        y += yscale < 0 ? (window.variables.sprite[sprite_name].height * yscale) / 2 : -(window.variables.sprite[sprite_name].height * yscale) / 2;
    }
    ctx.translate(x - (xscale < 0 ? window.variables.sprite[sprite_name].width * xscale : 0), y - (yscale < 0 ? window.variables.sprite[sprite_name].height * yscale : 0));
    ctx.scale(xscale, yscale);
    ctx.drawImage(window.variables.sprite[sprite_name], 0, 0, window.variables.sprite[sprite_name].width, window.variables.sprite[sprite_name].height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
}

/** 드로우 모드의 투명도를 설정합니다 */
export function draw_set_alpha(alpha) {
    window.variables.draw_alpha = Math.min(1, alpha);
}

/** 드로우 모드의 색을 설정합니다 */
export function draw_set_color(color) {
    window.variables.draw_color = color;
}

/** 드로우 모드의 폰트를 설정합니다 */
export function draw_set_font(size, font) {
    window.variables.draw_font_size = size;
    window.variables.draw_font = font;
}

/** ctx를 받고, 현재 캔버스의 설정을 입력합니다 */
function setDrawMode(ctx) {
    ctx.restore();
    ctx.scale(1, 1);
    ctx.font = `${window.variables.draw_font_size}px ${window.variables.draw_font}`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = window.variables.draw_alpha;
    ctx.fillStyle = window.variables.draw_color;
    ctx.strokeStyle = window.variables.draw_color;
}