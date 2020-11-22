import './config.js';
import { IOWatchStart } from './io.js';

//#CodeStart

export function set_canvas(canvas) {
  window.variables.canvas = canvas;
}

export function set_debug_mode(triggerBool) {
  window.variables.debug_mode = triggerBool;
}

/** @description UUID v4 generator in JavaScript (RFC4122 compliant) */
export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 3) | 8;
        return v.toString(16);
    });
}

export class ArtistElement {
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
export function instance_destroy(object_name) {
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

export function instance_create(object, x, y, depth) {
 if (depth === undefined) {
    depth = 0;
  }
  
  let ins = new object(depth, x, y);
  if (ins.create !== undefined) {
    ins.create();
  } 
  return ins;
}

export function set_fps(fpsInterval) {
  window.variables.fps_interval = 1000 / fpsInterval;
}

export async function render() {
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

export async function start() {
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
