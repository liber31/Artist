import { commonIOWatch } from '../98_Platform/base.js';
import { mobileIOWatch } from '../98_Platform/mobile.js';
import { pcIOWatch } from '../98_Platform/pc.js';
import '../config.js';

//#CodeStart

export function setTargetSize(width, height) {
  window.variables.WIDTH = width;
  window.variables.HEIGHT = height;
  window.variables.TARGET_CANVAS.width = window.variables.WIDTH;
  window.variables.TARGET_CANVAS.height = window.variables.HEIGHT;
}

export function setCanvas(canvas) {
  window.variables.CANVAS = canvas;
}

export function setFps(fpsInterval) {
  window.variables.FPS_INTERVAL = 1000 / fpsInterval;
}

export async function render() {
  const targetCanvas = window.variables.TARGET_CANVAS;
  const ctx = targetCanvas.getContext('2d');
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  ctx.rect(0, 0, targetCanvas.width, targetCanvas.height);
  ctx.fillStyle = 'white';
  ctx.fill();


  const canvas = window.variables.CANVAS;

  let targetWidth = 0;
  let targetHeight = 0;
  let letterBoxWidth = 0;
  let letterBoxHeight = 0;
  let resolution = getScreenResolution(window.variables.WIDTH, window.variables.HEIGHT);




  let ratio = 1;
  if (window.variables.FULLSCREEN === true) {
    ratio = window.devicePixelRatio;
    if (window.variables.DISPLAY_WIDTH / resolution.width >= window.variables.DISPLAY_HEIGHT / resolution.height) {
      targetWidth = (window.variables.DISPLAY_HEIGHT / resolution.height) * resolution.width;
      targetHeight = window.variables.DISPLAY_HEIGHT;
      letterBoxWidth = window.variables.DISPLAY_WIDTH - targetWidth;

      window.variables.MOUSE_X = window.variables.DISPLAY_MOUSE_X;
      window.variables.MOUSE_Y = (window.variables.DISPLAY_MOUSE_Y) * (window.variables.HEIGHT / window.variables.DISPLAY_HEIGHT);

      window.variables.MOUSE_X *= ratio;
      window.variables.MOUSE_Y *= ratio;

      window.variables.MOUSE_X -= letterBoxWidth / 2;
      window.variables.MOUSE_X = (window.variables.MOUSE_X) * (window.variables.WIDTH / (window.variables.DISPLAY_WIDTH - letterBoxWidth));
    } else {
      targetWidth = window.variables.DISPLAY_WIDTH;
      targetHeight = (window.variables.DISPLAY_WIDTH / resolution.width) * resolution.height;
      letterBoxHeight = window.variables.DISPLAY_HEIGHT - targetHeight;

      window.variables.MOUSE_X = (window.variables.DISPLAY_MOUSE_X) * (window.variables.WIDTH / window.variables.DISPLAY_WIDTH);
      window.variables.MOUSE_Y = window.variables.DISPLAY_MOUSE_Y;

      window.variables.MOUSE_X *= ratio;
      window.variables.MOUSE_Y *= ratio;

      window.variables.MOUSE_Y -= letterBoxHeight / 2;
      window.variables.MOUSE_Y = (window.variables.MOUSE_Y) * (window.variables.HEIGHT / (window.variables.DISPLAY_HEIGHT - letterBoxHeight));
    }

    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
  } else {
    window.variables.MOUSE_X = window.variables.DISPLAY_MOUSE_X;
    window.variables.MOUSE_Y = window.variables.DISPLAY_MOUSE_Y;

    targetWidth = window.variables.TARGET_CANVAS.width;
    targetHeight = window.variables.TARGET_CANVAS.height;
  }

  window.variables.DISPLAY_WIDTH = window.variables.CANVAS.width;
  window.variables.DISPLAY_HEIGHT = window.variables.CANVAS.height;

  const depth_list = Object.keys(window.variables.INSTANCES).sort((a, b) => Number(b) - Number(a));

  for (let depth of depth_list) {
    for (let object_name in window.variables.INSTANCES[depth]) {
      for (let index in window.variables.INSTANCES[depth][object_name]) {
        let item = window.variables.INSTANCES[depth][object_name][index];
        if (item.alive === true) {
          await item.prepare();
          await item.update();
          await item.draw();
        }
      }
    }
  }

  if (window.variables.DEBUG_MODE == true) {
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'green';
    ctx.globalAlpha = 1;
    ctx.fillText('FPS: ' + window.variables.FPS, 10, 33);
  }

  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').rect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').fillStyle = 'black';
  canvas.getContext('2d').fill();

  canvas.getContext('2d').drawImage(window.variables.TARGET_CANVAS, 0, 0, window.variables.TARGET_CANVAS.width, window.variables.TARGET_CANVAS.height, letterBoxWidth / 2, letterBoxHeight / 2, targetWidth, targetHeight);

  window.variables.MOUSE_PRESSED = false;
}

export async function start() {
  commonIOWatch();
  mobileIOWatch();
  pcIOWatch();

  let frameCount = 0;
  let then = performance.now();
  let elapsed = 0;

  async function frame() {
    const now = performance.now();
    elapsed = now - then;

    if (elapsed > window.variables.FPS_INTERVAL) {
      then = now - (elapsed % window.variables.FPS_INTERVAL);
      try {
        await render();
      } catch (err) {
        alert(err);
      }
      frameCount++;
    }
    window.variables.DELTA_TIME = elapsed / 1000;
    requestAnimationFrame(frame);
  }
  frame();

  setInterval(() => {
    window.variables.FPS = frameCount
    frameCount = 0;
  }, 1000);
}


function getScreenResolution(rwidth, rheight) {
  let max;
  let min;
  let temp;
  let gcd
  let war;
  let har;

  if (rwidth < rheight) {
    max = rwidth;
    min = rheight;
  } else {
    max = rheight;
    min = rwidth;
  } while (max % min != 0) {
    temp = max % min;
    max = min;
    min = temp;
  }
  gcd = min;
  war = rwidth / gcd;
  har = rheight / gcd;

  return {
    width: war,
    height: har
  }
}