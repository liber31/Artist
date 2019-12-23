function draw_rectangle(x1, y1, x2, y2, fill) {
  if (!fill) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
  } else {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0, 0, 0, 1)';
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  }
}

function draw_text(x, y, text) {
  const fpsCounter = canvas.getContext('2d');
  fpsCounter.font = '15px Arial';
  fpsCounter.textAlign = 'left';
  fpsCounter.fillText(text, x, y + 15);
}

function draw_text_transformed(x, y, text, size, align) {
  const fpsCounter = canvas.getContext('2d');
  fpsCounter.font = `${size}px Arial`;
  fpsCounter.textAlign = align;
  fpsCounter.fillText(text, x, y + size);
}
