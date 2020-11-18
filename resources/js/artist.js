import './config.js';
import { mobile_io_start, pc_io_start } from './io.js';

//#CodeStart
export function set_canvas(canvas) {
  window.variables.canvas = canvas;
}

export function set_debug_mode(triggerBool) {
  window.variables.debug_mode = triggerBool;
}

export function uuid() {
    // UUID v4 generator in JavaScript (RFC4122 compliant)
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
        if (window.variables.debug_mode == true) {
//          alert(`Instance created ${this.constructor.name} (${this.id})`);
        }

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
            if (window.variables.debug_mode == true) {
//              alert(`Instance destroyed ${this.constructor.name} (${this.id})`);
            }
            
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

/** 해당 이름을 가진 객체를 세계에서 제거합니다 */
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
  if (depth === 0) {
    alert('can not make instance at depth 0');    
    return;
  }
  
  if (depth === undefined) {
    depth = 1;
  }
  
  let ins = new object(depth, x, y);
  if (ins.create !== undefined) {
    ins.create();
  }  
  return ins;
}

export async function start() {
    if (window.variables.debug_mode == true) {
      console.log('debug mode enabled');
    }
    
    mobile_io_start();
    pc_io_start();

    async function loop() {      
        return new Promise(
        (resolve, reject) => {
            window.requestAnimationFrame(async () => {
              try {
                const now = performance.now();
                while (window.variables.display_time.length > 0
                && window.variables.display_time[0] <= now - 1000) {
                    window.variables.display_time.shift();
                }
                window.variables.display_time.push(now);
                window.variables.fps = window.variables.display_time.length;
  
                // 뒷 배경을 흰색으로 강제 초기화
                window.variables.canvas.getContext('2d').clearRect(0, 0, window.variables.canvas.width, window.variables.canvas.height);

                window.variables.mouse_x = window.variables.display_mouse_x;
                window.variables.mouse_y = window.variables.display_mouse_y;
               
                let ratio = 1;
                if (window.variables.fullscreen === true) {
                  window.variables.mouse_x *= 2;
                  window.variables.mouse_y *= 2;
                  ratio = 2;
                }
              
                window.variables.canvas.width = window.innerWidth * ratio;
                window.variables.canvas.height = window.innerHeight * ratio;
                window.variables.display_width = window.variables.canvas.width;
                window.variables.display_height = window.variables.canvas.height;
                window.variables.display_ratio = window.variables.display_width / window.variables.display_height;
                
                for (let depth in window.variables.instances) {
                    let instances_by_depth = window.variables.instances[depth];
                    for (let object_name in instances_by_depth) {
                        for (let index in instances_by_depth[object_name]) {
                            let _item = instances_by_depth[object_name][index];
                            if (_item.alive === true) {
                                await _item.prepare();
                            }
                        }
                    }
                }
                for (let depth in window.variables.instances) {
                    let instances_by_depth = window.variables.instances[depth];
                    for (let object_name in instances_by_depth) {
                        for (let index in instances_by_depth[object_name]) {
                            let _item = instances_by_depth[object_name][index];
                            if (_item.alive === true) {
                                await _item.update();
                            }
                        }
                    }
                }
                for (let depth in window.variables.instances) {
                    let instances_by_depth = window.variables.instances[depth];
                    for (let object_name in instances_by_depth) {
                        for (let index in instances_by_depth[object_name]) {
                            let _item = instances_by_depth[object_name][index];
                            if (_item.alive === true) {
                                await _item.draw();
                            }
                        }
                    }
                }

                window.variables.mouse_pressed = false;
  
                if (window.variables.debug_mode == true) {
                    const ctx = window.variables.canvas.getContext('2d');
                    ctx.font = '15px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillStyle = 'green';
                    ctx.globalAlpha = 1;
                    ctx.fillText(window.variables.fps, 5, 15);
                }
              } catch(err) {
                alert(err);
                reject(err);
              }
              resolve();
          });
      });
    }

    while (true) {
      await loop();
    }
}