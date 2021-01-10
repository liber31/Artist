// -- -- -- -- -- -- -- -- -- -- -- --
// "Artist.js" 2D Graphic Framework
// -- -- -- -- -- -- -- -- -- -- -- --


function setTargetSize(width, height) {
  window.variables.WIDTH = width;
  window.variables.HEIGHT = height;
  window.variables.TARGET_CANVAS.width = window.variables.WIDTH;
  window.variables.TARGET_CANVAS.height = window.variables.HEIGHT;
}

function setCanvas(canvas) {
  window.variables.CANVAS = canvas;
}

function setFps(fpsInterval) {
  window.variables.FPS_INTERVAL = 1000 / fpsInterval;
}

async function render() {
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

async function start() {
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


class ArtistElement {
    constructor(depth, x, y) {
        this.alive = true;
        this.id = uuid();
        if (!window.variables.INSTANCES[depth]) {
            window.variables.INSTANCES[depth] = {};
        }

        if (!window.variables.INSTANCES[depth][this.constructor.name]) {
            window.variables.INSTANCES[depth][this.constructor.name] = [];
        }
        window.variables.INSTANCES[depth][this.constructor.name][this.id] = this;

        this.x = x;
        this.y = y;
        this.xscale = 1;
        this.yscale = 1;
        this.collider_width = 0;
        this.collider_height = 0;
        this.depth = depth;
    }

    async destroyProcess() {
        if (this.alive === true) {
            if (this.destroy !== undefined) {
                await this.destroy();
            }

            this.alive = false;
            delete this.x;
            delete this.y;
            delete this.id;
            delete this.collider_width;
            delete this.collider_height;
            delete window.variables.INSTANCES[this.depth][this.constructor.name][this.id];
        }
    }

    async prepare() {
        if (window.variables.MOUSE_PRESSED && this.pressedGlobal !== undefined) {
            await this.pressedGlobal();
        }
        if (window.variables.MOUSE_CLICK && this.clickGlobal !== undefined) {
            await this.clickGlobal();
        }

        if (this.collider_width !== 0 && this.collider_height !== 0) {
            if (
                window.variables.MOUSE_X >= this.x - this.collider_width / 2 &&
                window.variables.MOUSE_X <= this.x + this.collider_width / 2 &&
                window.variables.MOUSE_Y >= this.y - this.collider_height / 2 &&
                window.variables.MOUSE_Y <= this.y + this.collider_height / 2
            ) {
                if (window.variables.MOUSE_PRESSED && this.pressedMe !== undefined) {
                    await this.pressedMe();
                }
                if (window.variables.MOUSE_CLICK && this.clickMe !== undefined) {
                    await this.clickMe();
                }
            }
        }
    }

    async update() { }

    async draw() { }
}

/** @description 해당 이름을 가진 객체를 세계에서 제거합니다 */
function instanceDestroy(object_name) {
    if (typeof object_name === 'object' && object_name.destroyProcess !== undefined) {
        object_name.destroyProcess();
    }

    for (let depth in window.variables.INSTANCES) {
        for (let object in window.variables.INSTANCES[depth][object_name]) {
            let _item = window.variables.INSTANCES[depth][object_name][object];
            _item.destroyProcess();
            delete window.variables.INSTANCES[depth][object_name][object];
        }
    }
}

function instanceCreate(object, x, y, depth) {
    if (depth === undefined) {
        depth = 0;
    }

    let ins = new object(depth, x, y);
    if (ins.create !== undefined) {
        ins.create();
    }
    return ins;
}



function drawSetAlpha(alpha) {
    window.variables.DRAW_ALPHA = Math.min(1, alpha);
}

function drawSetColor(color) {
    window.variables.DRAW_COLOR = color;
}

function drawSetFilter(filter) {
    window.variables.DRAW_FILTER = filter;
}

/** ctx를 받고, 현재 캔버스의 설정을 입력합니다 */
function setDrawMode(ctx) {
    ctx.restore();
    ctx.scale(1, 1);
    ctx.font = `${window.variables.DRAW_FONT_SIZE}px ${window.variables.DRAW_FONT}`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = window.variables.DRAW_ALPHA;
    ctx.fillStyle = window.variables.DRAW_COLOR;
    ctx.strokeStyle = window.variables.DRAW_COLOR;
    ctx.filter = window.variables.DRAW_FILTER;
}


/** 선을 그립니다 */
function drawLine(x1, y1, x2, y2) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/** 해당 두께의 선을 그립니다 */
function drawLineThick(x1, y1, x2, y2, width) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width;
    ctx.stroke();
}

/** 사각형을 그립니다 */
function drawRectangle(x1, y1, x2, y2, fill) {
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
function drawCircle(x, y, r, fill) {
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


/** 이미지를 불러옵니다 */
function spriteLoad(dir, sprite_name) {
    let img = new Image();
    img.src = dir;

    window.variables.SPRITE[sprite_name] = img;
}

function spriteGetWidth(sprite_name) {
    return window.variables.SPRITE[sprite_name].width;
}
function spriteGetHeight(sprite_name) {
    return window.variables.SPRITE[sprite_name].height;
}

/** 불러온 이미지를 그립니다 */
function drawSprite(x, y, sprite_name) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.drawImage(window.variables.SPRITE[sprite_name], x, y, window.variables.SPRITE[sprite_name].width, window.variables.SPRITE[sprite_name].height);
}

/** 해당 이미지를 해당 정렬 방식과 사이즈에 맞추어 그립니다 */
function drawSpriteExt(x, y, sprite_name, align, xscale, yscale, angle) {
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





/** 글자를 그립니다 */
function drawText(x, y, text) {
    const ctx = window.variables.TARGET_CANVAS.getContext('2d');
    setDrawMode(ctx);
    ctx.textAlign = 'left';
    ctx.fillText(text, x, y + 15);
}

/** 글자를 해당 정렬 방식에 맞추어 그립니다. align: "left" or "right" or "center" */
function drawTextTransformed(x, y, text, align, angle = 0) {
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
function drawSetFont(size, font) {
    window.variables.DRAW_FONT_SIZE = size;
    window.variables.DRAW_FONT = font;
}




function lengthdirX(dist, angle) {
    return dist * Math.cos(angle * (Math.PI / 180));
}

function lengthdirY(dist, angle) {
    return dist * -Math.sin(angle * (Math.PI / 180));
}

/**
 * 두 점간의 길이를 반환합니다.
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @return number
 */
function pointDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

/**
 * 두 점간의 각도를 반환합니다.
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @return number
 */
function pointDirection(x1, y1, x2, y2) {
    let rad = Math.atan2(y2 - y1, x2 - x1);
    let degree = (rad * 180) / Math.PI;
    if (degree < 0) {
        degree = 360 + degree;
    }
    return 360 - degree;
}

// 참고: https://easings.net/ko

function easeInQuad(value) {
    return value * value;
}

function easeOutQuad(value) {
    return -value * (value - 2);
}

function easeInOutQuad(value) {
    let t = value * 2;

    if (t < 1) {
        return 0.5 * t * t;
    }

    t -= 1;
    return -0.5 * (t * (t - 2) - 1);
}

function easeInCubic(value) {
    return value * value * value;
}

function easeOutCubic(value) {
    let t = value - 1;
    return t * t * t + 1;
}

function easeInOutCubic(value) {
    let t = value * 2;

    if (t < 1) {
        return 0.5 * t * t * t;
    }

    t -= 2;
    return 0.5 * (t * t * t + 2);
}

function easeInQuartic(value) {
    return value * value * value * value;
}

function easeOutQuartic(value) {
    let t = value - 1;
    return -(t * t * t * t - 1);
}

function easeInOutQuartic(value) {
    let t = value * 2;

    if (t < 1) {
        return 0.5 * t * t * t * t;
    }

    t -= 2;
    return -0.5 * (t * t * t * t - 2);
}

function easeInQuintic(value) {
    return value * value * value * value * value;
}

function easeOutQuintic(value) {
    let t = value - 1;
    return t * t * t * t * t + 1;
}

function easeInOutQuintic(value) {
    let t = value * 2;

    if (t < 1) {
        return 0.5 * t * t * t * t * t;
    }

    t -= 2;
    return 0.5 * (t * t * t * t * t + 2);
}

function easeInSine(value) {
    return -Math.cos(value * Math.PI / 2) + 1;
}

function easeOutSine(value) {
    return Math.sin(value * Math.PI / 2);
}

function easeInOutSine(value) {
    return -0.5 * (Math.cos(value * Math.PI) - 1);
}

function easeInExpo(value) {
    if (value === 0) {
        return 0;
    }
    return Math.pow(2, 10 * (value - 1));
}

function easeOutExpo(value) {
    if (value === 1) {
        return 1;
    }
    return -Math.pow(2, -10 * value) + 1;
}

function easeInOutExpo(value) {
    if (value === 0) {
        return 0;
    } else if (value === 1) {
        return 1;
    }

    let t = value * 2;

    if (t < 1) {
        return 0.5 * Math.pow(2, 10 * (t - 1));
    }

    return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
}

function easeInCirc(value) {
    if (value <= 0) {
        return 0;
    } else if (value >= 1) {
        return 1;
    }
    return -(Math.sqrt(1 - value * value) - 1);
}

function easeOutCirc(value) {
    if (value <= 0) {
        return 0;
    } else if (value >= 1) {
        return 1;
    }

    let t = value - 1;
    return Math.sqrt(1 - t * t);
}

function easeInOutCirc(value) {
    if (value <= 0) {
        return 0;
    } else if (value >= 1) {
        return 1;
    }

    let t = value * 2;

    if (t < 1) {
        return -0.5 * (Math.sqrt(1 - t * t) - 1);
    }

    t -= 2;
    return 0.5 * (Math.sqrt(1 - t * t) + 1);
}

function easeInElastic(value) {
    if (value === 0) {
        return 0;
    } else if (value === 1) {
        return 1;
    }
    let p = 0.3;
    let s = p / 4;
    let t = value - 1;
    return -(Math.pow(2, 10 * t)) * Math.sin((t - s) * (2 * Math.PI) / p);
}

function easeOutElastic(value) {
    if (value === 0) {
        return 0;
    } else if (value === 1) {
        return 1;
    }

    let p = 0.3;
    let s = p / 4;
    return Math.pow(2, -10 * value) * Math.sin((value - s) * (2 * Math.PI) / p) + 1;
}

function easeInOutElastic(value) {
    if (value === 0) {
        return 0;
    } else if (value === 1) {
        return 1;
    }

    let p = 0.3;
    let s = p / 4;
    let t = value * 2 - 1;

    if (t < 0) {
        return -0.5 * (Math.pow(2, 10 * t) * Math.sin((t - s) * (2 * Math.PI) / p));
    }

    return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
}

function easeInBack(value) {
    let s = 1.70158;
    return value * value * ((s + 1) * value - s);
}

function easeOutBack(value) {
    let s = 1.70158;
    let t = value - 1;
    return t * t * ((s + 1) * t + s) + 1;
}

function easeInOutBack(value) {
    let s = 1.70158;
    let t = value * 2;
    s *= 1.525;
    if (t < 1) {
        return 0.5 * (t * t * ((s + 1) * t - s));
    }

    t -= 2;
    return 0.5 * (t * t * ((s + 1) * t + s) + 2);
}

function easeInBounce(value) {
    return 1 - easeOutBounce(1 - value);
}

function easeOutBounce(value) {
    let t = value;
    if (t < 1 / 2.75) {
        return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
        t -= 1.5 / 2.75;
        return 7.5625 * t * t + 0.75;
    } else if (t < 2.5 / 2.75) {
        t -= 2.25 / 2.75;
        return 7.5625 * t * t + 0.9375;
    } else {
        t -= 2.625 / 2.75;
        return 7.5625 * t * t + 0.984375;
    }
}

function easeInOutBounce(value) {
    if (value < 0.5) {
        return 0.5 - easeOutBounce(1 - value * 2) * 0.5;
    } else {
        return 0.5 + easeOutBounce(value * 2 - 1) * 0.5;
    }
}


/**
 * 랜덤 값을 반환합니다.
 * @param {*} min
 * @param {*} max
 * @return number
 */
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 정수 랜덤 값을 반환합니다.
 * @param {*} min
 * @param {*} max
 * @return number
 */
function irandomRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + min;
}


function setDebugMode(triggerBool) {
    window.variables.DEBUG_MODE = triggerBool;
}


/** 해당 url로 post request를 보냅니다. */
async function request(url, object) {
    return new Promise((resolve, _reject) => {
        let http = new XMLHttpRequest();
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
        http.setRequestHeader('Connection', 'close');
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                if (window.variables.debug == true) console.log('[HTTP RECV]', http.responseText);

                resolve(JSON.parse(http.responseText));
            }
        };
        if (window.variables.debug == true) console.log('[HTTP SEND]', JSON.stringify(object));

        http.send(JSON.stringify(object));
    });
}



function setFullScreen(triggerBool) {
    window.variables.CANVAS.style['touch-action'] = 'none';
    window.variables.CANVAS.style.cursor = 'inherit';

    if (triggerBool === false) {
        window.variables.CANVAS.width = window.variables.WIDTH;
        window.variables.CANVAS.height = window.variables.HEIGHT;
        window.variables.CANVAS.style.width = `${window.variables.CANVAS.width}px`;
        window.variables.CANVAS.style.height = `${window.variables.CANVAS.height}px`;
        return;
    }

    window.variables.CANVAS.style.width = '100%';
    window.variables.CANVAS.style.height = '100%';
    window.variables.CANVAS.style['touch-action'] = 'none';
    window.variables.CANVAS.style.cursor = 'inherit';
    window.variables.FULLSCREEN = true;
    window.variables.CANVAS.width = window.innerWidth * 2;
    window.variables.CANVAS.height = window.innerHeight * 2;
    window.variables.DISPLAY_WIDTH = window.variables.CANVAS.width;
    window.variables.DISPLAY_HEIGHT = window.variables.CANVAS.height;
}

/** @description I/O 처리 이벤트에 핸들러를 등록해줍니다 */
function commonIOWatch() {
    window.onkeydown = onKeyboardDown;
    window.onkeyup = onKeyboardUp;
}

function onKeyboardDown(evt) {
    window.variables.KEYBOARD_CHECK = true;
    window.variables.KEYBOARD_CODE = evt.which || evt.keyCode;
}

function onKeyboardUp(_evt) {
    window.variables.KEYBOARD_CHECK = false;
    window.variables.KEYBOARD_CODE - 1;
}


function mobileIOWatch() {
    window.variables.CANVAS.addEventListener('touchstart', onTouchStart);
    window.variables.CANVAS.addEventListener('touchend', onTouchEnd);
    window.variables.CANVAS.addEventListener('touchmove', onTouchMove);
}

function onTouchStart(evt) {
    const touch = evt.touches[0];
    window.variables.DISPLAY_MOUSE_X = touch.clientX;
    window.variables.DISPLAY_MOUSE_Y = touch.clientY;
    window.variables.MOUSE_PRESSED = true;
    window.variables.MOUSE_CLICK = true;
}

function onTouchEnd() {
    window.variables.MOUSE_CLICK = false;
}

function onTouchMove(evt) {
    const touch = evt.touches[0];
    window.variables.DISPLAY_MOUSE_X = touch.clientX;
    window.variables.DISPLAY_MOUSE_Y = touch.clientY;
}



/** @description I/O 처리 이벤트에 핸들러를 등록해줍니다 */
function pcIOWatch() {
    window.addEventListener('mousemove', onMouseUpdate);
    window.addEventListener('mouseenter', onMouseUpdate);
    window.onmousedown = onMouseDown;
    window.onmouseup = onMouseUp;
}


/** @description 마우스의 실제 좌표를 가져옵니다 */
function getMousePosition(canvas, evt) {
    if (!!canvas === false) {
        throw 'getMousePos - canvas is not exists';
    }
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    }
}

/** @description 마우스의 위치를 업데이트 해주는 이벤트 핸들러입니다 */
function onMouseUpdate(evt) {
    const pos = getMousePosition(window.variables.CANVAS, evt);
    window.variables.DISPLAY_MOUSE_X = pos.x;
    window.variables.DISPLAY_MOUSE_Y = pos.y;
}

function onMouseDown(_evt) {
    if (window.variables.MOUSE_X >= 0 && window.variables.MOUSE_Y >= 0 && window.variables.MOUSE_X <= window.variables.DISPLAY_WIDTH && window.variables.MOUSE_Y <= window.variables.DISPLAY_HEIGHT) {
        window.variables.MOUSE_PRESSED = true;
        window.variables.MOUSE_CLICK = true;
    }
}

function onMouseUp(_evt) {
    if (window.variables.MOUSE_X >= 0 && window.variables.MOUSE_Y >= 0 && window.variables.MOUSE_X <= window.variables.DISPLAY_WIDTH && window.variables.MOUSE_Y <= window.variables.DISPLAY_HEIGHT) {
        window.variables.MOUSE_CLICK = false;
    }
}

/**
 * @description UUID v4 generator in JavaScript (RFC4122 compliant)
 * @return string 
 */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 3) | 8;
        return v.toString(16);
    });
}
 
window.variables = {
    CANVAS: undefined,

    DEBUG_MODE: false,
    FPS: 0,
    FPS_INTERVAL: 100 / 6,
    FULLSCREEN: false,
    DELTA_TIME: 0,

    TARGET_CANVAS: document.createElement('canvas'),
    WIDTH: 0,
    HEIGHT: 0,

    DISPLAY_WIDTH: 0,
    DISPLAY_HEIGHT: 0,

    INSTANCES: {},

    SPRITE: {},

    KEYBOARD_CHECK: false,
    KEYBOARD_CODE: -1,

    MOUSE_PRESSED: false,
    MOUSE_CLICK: false,
    MOUSE_X: 0,
    MOUSE_Y: 0,
    DISPLAY_MOUSE_X: 0,
    DISPLAY_MOUSE_Y: 0,

    DRAW_COLOR: 'black',
    DRAW_ALPHA: 1,
    DRAW_FONT: 'Arial',
    DRAW_FONT_SIZE: 15,
    DRAW_FILTER: 'none',
};
