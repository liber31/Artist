// -- -- -- -- -- -- -- -- -- -- -- --
// "Artist.js" 2D Graphic Framework
// -- -- -- -- -- -- -- -- -- -- -- --


function set_canvas(canvas) {
  window.variables.canvas = canvas;
}

function set_debug_mode(triggerBool) {
  window.variables.debug_mode = triggerBool;
}

/** @description UUID v4 generator in JavaScript (RFC4122 compliant) */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 3) | 8;
        return v.toString(16);
    });
}

class ArtistElement {
    constructor(depth, x, y) {
        this.alive = true;
        this.id = uuid();
        if (!window.variables.instances[depth]) {
            window.variables.instances[depth] = {};
        }

        if (!window.variables.instances[depth][this.constructor.name]) {
            window.variables.instances[depth][this.constructor.name] = [];
        }
        window.variables.instances[depth][this.constructor.name][this.id] = this;

        this.x = x;
        this.y = y;
        this.xscale = 1;
        this.yscale = 1;
        this.collider_width = 0;
        this.collider_height = 0;
        this.depth = depth;        
    }

    /** 객체의 생사 여부를 결정 짓는 함수입니다 */        
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
            delete window.variables.instances[this.depth][this.constructor.name][this.id];
        }
    }

    async prepare() {
        if (this.collider_width !== 0 && this.collider_height !== 0) {
            if (
                window.variables.mouse_x >= this.x - this.collider_width / 2 &&
                window.variables.mouse_x <= this.x + this.collider_width / 2 &&
                window.variables.mouse_y >= this.y - this.collider_height / 2 &&
                window.variables.mouse_y <= this.y + this.collider_height / 2
            ) {
                if (window.variables.mouse_pressed && this.pressed_me !== undefined) {
                    await this.pressed_me();
                }
                if (window.variables.mouse_click && this.click_me !== undefined) {
                    await this.click_me();
                }
            }
        }
        
        if (window.variables.mouse_pressed && this.pressed_global !== undefined) {
            await this.pressed_global();
        }
        if (window.variables.mouse_click && this.click_global !== undefined) {
            await this.click_global();
        }
    }

    async update() {}

    async draw() {}
}

/** @description 해당 이름을 가진 객체를 세계에서 제거합니다 */
function instance_destroy(object_name) {
  if (typeof object_name === 'object' && object_name.destroyProcess !== undefined) {
    object_name.destroyProcess();
  }
  
    for (let depth in window.variables.instances) {
        for (let object in window.variables.instances[depth][object_name]) {
            let _item = window.variables.instances[depth][object_name][object];
            _item.destroyProcess();
            delete window.variables.instances[depth][object_name][object];
        }
    }
}

function instance_create(object, x, y, depth) {
 if (depth === undefined) {
    depth = 0;
  }
  
  let ins = new object(depth, x, y);
  if (ins.create !== undefined) {
    ins.create();
  } 
  return ins;
}

function set_fps(fpsInterval) {
  window.variables.fps_interval = 1000 / fpsInterval;
}

async function render() {
  const canvas = window.variables.canvas;
  const variables = window.variables;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

  variables.mouse_x = variables.display_mouse_x;
  variables.mouse_y = variables.display_mouse_y;
     
  let ratio = 1;
  if (window.variables.fullscreen === true) {
    ratio = window.devicePixelRatio;
    window.variables.mouse_x *= ratio;
    window.variables.mouse_y *= ratio;
    window.variables.ratio = ratio;
  }
    
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  variables.display_width = variables.canvas.width;
  variables.display_height = variables.canvas.height;
  variables.display_ratio = variables.display_width / variables.display_height;
     
  const depth_list = Object.keys(variables.instances).sort((a, b) => Number(a) < Number(b));
  
  for (let depth of depth_list) {
      for (let object_name in variables.instances[depth]) {
          for (let index in variables.instances[depth][object_name]) {
              let item = variables.instances[depth][object_name][index];
              if (item.alive === true) {
                  await item.prepare();
                  await item.update();
                  await item.draw();
              }
          }
      }
  }
  variables.mouse_pressed = false;

  if (variables.debug_mode == true) {
      const ctx = canvas.getContext('2d');
      ctx.font = '15px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'green';
      ctx.globalAlpha = 1;
      ctx.fillText(variables.fps, 5, 15);
  }
}

async function start() {
    IOWatchStart();

    let frameCount = 0;
    let then = performance.now();
    let startTime = then;
    let elapsed = 0;
    
    async function frame() {
      const now = performance.now();
      elapsed = now - then;
      
      if (elapsed > window.variables.fps_interval) {
        then = now - (elapsed % window.variables.fps_interval);
        try { await render(); } catch(err) { alert(err); }
        frameCount++;
      }
      window.variables.delta_time = elapsed / 1000;
      requestAnimationFrame(frame);
    }
    
    setInterval(() => {
      window.variables.fps = frameCount
      frameCount = 0;
    }, 1000);
    frame();
}

 
window.variables = {
    canvas: undefined,
        
    debug_mode: false,
    fps: 0,
    fps_interval: 60,
    fullscreen: false,
    delta_time: 0,
    display_width: 0,
    display_height: 0,
    display_ratio: 0,
  
    update_queue: [],
    late_update_queue: [],
    draw_queue: [],
    
    instances: {},

    sprite: {},
    
    keyboard_check: false,
    keyboard_code: -1,

    mouse_pressed: false,
    mouse_click: false,
    mouse_x: 0,
    mouse_y: 0,
    display_mouse_x: 0,
    display_mouse_y: 0,

    draw_color: 'black',
    draw_alpha: 1,
    draw_font: 'Arial',
    draw_font_size: 15,
    draw_filter: 'none',
};


function set_fullscreen(triggerBool) {
  if (triggerBool === false) {    
    return;
  }
  
  window.variables.canvas.style.width = '100%';
  window.variables.canvas.style.height = '100%';
  window.variables.fullscreen = true;
  window.variables.canvas.width = window.innerWidth * 2;
  window.variables.canvas.height = window.innerHeight * 2;
  window.variables.display_width = window.variables.canvas.width;
  window.variables.display_height = window.variables.canvas.height;
  window.variables.display_ratio = window.variables.display_width / window.variables.display_height;
  window.variables.canvas.style['touch-action'] = 'none';
  window.variables.canvas.style.cursor = 'inherit';
}

const color = {
    black: 'black',
    green: 'green',
    red: 'red',
    white: 'white',
    gray: 'gray',
    yellow: 'yellow',
};

/** 사각형을 그립니다 */
function draw_rectangle(x1, y1, x2, y2, fill) {
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
function draw_circle(x, y, r, fill) {
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
function draw_text(x, y, text) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.textAlign = 'left';
    ctx.fillText(text, x, y + 15);
}

/** 글자를 해당 정렬 방식에 맞추어 그립니다. align: "left" or "right" or "center" */
function draw_text_transformed(x, y, text, align, angle = 0) {
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
function draw_line(x1, y1, x2, y2) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/** 해당 두께의 선을 그립니다 */
function draw_line_width(x1, y1, x2, y2, width) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width;
    ctx.stroke();
}

/** 이미지를 불러옵니다 */
function sprite_load(dir, sprite_name) {
    let img = new Image();
    img.src = dir;

    window.variables.sprite[sprite_name] = img;
}

function sprite_get_width(sprite_name) {
    return window.variables.sprite[sprite_name].width;
}
function sprite_get_height(sprite_name) {
    return window.variables.sprite[sprite_name].height;
}

/** 불러온 이미지를 그립니다 */
function draw_sprite(x, y, sprite_name) {
    const ctx = window.variables.canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.drawImage(window.variables.sprite[sprite_name], x, y, window.variables.sprite[sprite_name].width, window.variables.sprite[sprite_name].height);
}

/** 해당 이미지를 해당 정렬 방식과 사이즈에 맞추어 그립니다 */
function draw_sprite_ext(x, y, sprite_name, align, xscale, yscale, angle) {
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
function draw_set_alpha(alpha) {
    window.variables.draw_alpha = Math.min(1, alpha);
}

/** 드로우 모드의 색을 설정합니다 */
function draw_set_color(color) {
    window.variables.draw_color = color;
}

function draw_set_filter(filter) {
    window.variables.draw_filter = filter;
}

/** 드로우 모드의 폰트를 설정합니다 */
function draw_set_font(size, font) {
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
    ctx.filter = window.variables.draw_filter;
}


/** @description I/O 처리 이벤트에 핸들러를 등록해줍니다 */
function IOWatchStart() {
  // Moblie
  window.variables.canvas.addEventListener('touchstart', onTouchStart);
  window.variables.canvas.addEventListener('touchend', onTouchEnd);
  window.variables.canvas.addEventListener('touchmove', onTouchMove);

  // PC
  window.addEventListener('mousemove', onMouseUpdate);
  window.addEventListener('mouseenter', onMouseUpdate);
  window.onmousedown = onMouseDown;
  window.onmouseup = onMouseUp;
  
  // Common
  window.onkeydown = onKeyboardDown;
  window.onkeyup = onKeyboardUp;
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
  const pos = getMousePosition(window.variables.canvas, evt);
  window.variables.display_mouse_x = pos.x;
  window.variables.display_mouse_y = pos.y;
}

function onMouseDown(_evt) {
  if (window.variables.mouse_x >= 0 && window.variables.mouse_y >= 0 && window.variables.mouse_x <= window.variables.width && window.variables.mouse_y <= window.variables.height) {
    window.variables.mouse_pressed = true;
    window.variables.mouse_click = true;
  }
}

function onMouseUp(_evt) {
  if (window.variables.mouse_x >= 0 && window.variables.mouse_y >= 0 && window.variables.mouse_x <= window.variables.width && window.variables.mouse_y <= window.variables.height) {
    window.variables.mouse_click = false;
  }
}

function onKeyboardDown(evt) {
  window.variables.keyboard_check = true;
  window.variables.keyboard_code = evt.which || evt.keyCode;
}

function onKeyboardUp(_evt) {
  window.variables.keyboard_check = false;
  window.variables.keyboard_code - 1;
}

function onTouchStart(evt) {
  const touch = evt.touches[0];
  window.variables.display_mouse_x = touch.clientX;
  window.variables.display_mouse_y = touch.clientY;
  window.variables.mouse_pressed = true;
  window.variables.mouse_click = true;
}

function onTouchEnd() {
  window.variables.mouse_click = false;
}

function onTouchMove(evt) {
  const touch = evt.touches[0];
  window.variables.display_mouse_x = touch.clientX;
  window.variables.display_mouse_y = touch.clientY;
}
 
function lengthdir_x(dist, angle) {
    return dist * Math.cos(angle * (Math.PI / 180));
}

function lengthdir_y(dist, angle) {
    return dist * -Math.sin(angle * (Math.PI / 180));
}

function point_distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function point_direction(x1, y1, x2, y2) {
  let rad = Math.atan2(y2 - y1, x2 - x1);
  let degree = (rad * 180) / Math.PI;
  if (degree < 0) {
    degree = 360 + degree;
  }
  return 360 - degree;
}

function random_range(min, max) {
  return Math.random() * (max - min) + min;
}

function irandom_range(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.round(Math.random() * (max - min)) + min;
}

function ease_in_quad(value) {
  return value * value;
}

function ease_out_quad(value) {
  return -value * (value - 2);
}

function ease_in_out_quad(value) {
  let t = value * 2;

  if (t < 1) {
    return 0.5 * t * t;
  }

  t -= 1;
  return -0.5 * (t * (t - 2) - 1);
}

function ease_in_cubic(value) {
  return value * value * value;
}

function ease_out_cubic(value) {
  let t = value - 1;
  return t * t * t + 1;
}

function ease_in_out_cubic(value) {
  let t = value * 2;
  
  if (t < 1) {
    return 0.5 * t * t * t;
  }
  
  t -= 2;
  return 0.5 * (t * t * t + 2);
}

function ease_in_quartic(value) {
  return value * value * value * value;
}

function ease_out_quartic(value) {
  let t = value - 1;
  return -(t * t * t * t - 1);
}

function ease_in_out_quartic(value) {
  let t = value * 2;
  
  if (t < 1) {
    return 0.5 * t * t * t * t;
  }
  
  t -= 2;
  return -0.5 * (t * t * t * t - 2);
}

function ease_in_quintic(value) {
  return value * value * value * value * value;
}

function ease_out_quintic(value) {
  let t = value - 1;
  return t * t * t * t * t + 1;
}

function ease_in_out_quintic(value) {
  let t = value * 2;
  
  if (t < 1) {
    return 0.5 * t * t * t * t * t;
  }
  
  t -= 2;
  return 0.5 * (t * t * t * t * t + 2);
}

function ease_in_sine(value) {
  return -Math.cos(value * Math.PI / 2) + 1;
}

function ease_out_sine(value) {
  return Math.sin(value * Math.PI / 2);
}

function ease_in_out_sine(value) {
  return -0.5 * (Math.cos(value * Math.PI) - 1);
}

function ease_in_expo(value) {
  if (value === 0) {
    return 0;
  }
  return Math.pow(2, 10 * (value - 1));
}

function ease_out_expo(value) {
  if (value === 1) {
    return 1;
  }
  return -Math.pow(2, -10 * value) + 1;
}

function ease_in_out_expo(value) {
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

function ease_in_circ(value) {
  if (value <= 0) {
    return 0;
  } else if (value >= 1) {
    return 1;
  }
  return -(Math.sqrt(1 - value * value) - 1);
}

function ease_out_circ(value) {
  if (value <= 0) {
    return 0;
  } else if (value >= 1) {
    return 1;
  }
  
  let t = value - 1;
  return Math.sqrt(1 - t * t);
}

function ease_in_out_circ(value) {
  if (value <= 0) {
    return 0;
  } else if (value >= 1) {
    return 1;
  }
  
  let t =value * 2;
  
  if (t < 1) {
    return -0.5 * (Math.sqrt(1 - t * t) - 1);
  }
  
  t -= 2;
  return 0.5 * (Math.sqrt(1 - t * t) + 1);
}

function ease_in_elastic(value) {
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

function ease_out_elastic(value) {
  if (value === 0) {
    return 0;
  } else if (value === 1) {
    return 1;
  }
  
  let p = 0.3;
  let s = p / 4;
  return Math.pow(2, -10 * value) * Math.sin((value - s) * (2 * Math.PI) / p) + 1;
}

function ease_in_out_elastic(value) {
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

function ease_in_back(value) {
  let s = 1.70158;
  return value * value * ((s + 1) * value - s);
}

function ease_out_back(value) {
  let s = 1.70158;
  let t = value - 1;
  return t * t * ((s + 1) * t + s) + 1;
}

function ease_in_out_back(value) {
  let s = 1.70158;
  let t = value * 2;
  s *= 1.525;
  if (t < 1) {
    return 0.5 * (t * t *((s + 1) * t - s));
  }
  
  t -= 2;
  return 0.5 * (t * t * ((s + 1) * t + s) + 2);
}

function ease_in_bounce(value) {
  return 1 - ease_out_bounce(1 - value);
}

function ease_out_bounce(value) {
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

function ease_in_out_bounce(value) {
  if (value < 0.5) {
    return 0.5 - ease_out_bounce(1 - value * 2) * 0.5;
  } else {
    return 0.5 + ease_out_bounce(value * 2 - 1) * 0.5;
  }
}

/** 해당 url로 post request를 보냅니다. */
async function request(url, object) {
    return new Promise((resolve, _reject) => {
        let http = new XMLHttpRequest();
        http.open('POST', url, true);

        http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
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


