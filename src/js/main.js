function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
  }
}
function cls() {
  var canvas = document.getElementById('canvas');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;

    cls();
    draw();
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = '15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(fps, 15, 15);

    refreshLoop();
  });
}

refreshLoop();
