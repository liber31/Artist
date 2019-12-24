function draw_rectangle(x1, y1, x2, y2, fill) {
  if (!fill) {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
  } else {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  }
}

function draw_circle(x, y, r, fill) {
  if (!fill) {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  } else {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

function draw_text(x, y, text) {
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.font = '15px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(text, x, y + 15);
}

function draw_text_transformed(x, y, text, size, align) {
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.font = `${size}px Arial`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y + size);
}

function draw_line(x1, y1, x2, y2) {
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function draw_line_width(x1, y1, x2, y2, width) {
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.stroke();
}

function sprite_load(dir, sprite_name) {
  let img = new Image();
  img.src = dir;

  sprite[sprite_name] = img;
}

function draw_sprite(x, y, sprite_name) {
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.drawImage(sprite[sprite_name], x, y, sprite[sprite_name].width, sprite[sprite_name].height);
}

function draw_sprite_ext(x, y, sprite_name, align, xscale, yscale) {
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  if (align == 'center') {
    x -= (sprite[sprite_name].width * xscale) / 2;
    y -= (sprite[sprite_name].height * yscale) / 2;
  }

  ctx.drawImage(sprite[sprite_name], x, y, sprite[sprite_name].width * xscale, sprite[sprite_name].height * yscale);
}

function draw_set_alpha(alpha) {
  draw_alpha = alpha;
}

function draw_set_color(color) {
  draw_color = color;
}
