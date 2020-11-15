//#CodeStart
class ArtistEngine {
  constructor() {
    this.renderer = new PIXI.Renderer({
      resolution: devicePixelRatio,
      backgroundColor: 0x000000
    });
    document.body.appendChild(this.renderer.view);
    
    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.render_time = [];
    this.fps = 0;
    this.debug = false;
    this.layers = {};
    this.layers_cache = [];
    
    window.variables = {
      graphics: this.graphics
    }
  }
  
  set_screen_size(width, height) {
    this.renderer.resize(width, height);
  }
  
  set_fullscreen() {
    this.renderer.autoResize = true;
    this.renderer.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }
  
  set_debug_mode() {
    this.debug = true;
    this.debug_text = new PIXI.Text('0', new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 10,
        fill: ['#00ff99', '#00ff99'], // gradient
    }));
    this.debug_text.x = 2;
    this.debug_text.y = 2;
    this.debug_text.anchor.set(0, 0);    
  }
  
  start() {
    this.render();
  }
  
  async render() {
    while(true) {
      await this.render_tick();
    }
  }
  
  async render_tick() {
    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(async () => {
        try {
          const now = performance.now();
          while (this.render_time.length > 0 && this.render_time[0] <= now - 1000) {
            this.render_time.shift();
          }
          this.render_time.push(now);
          this.fps = this.render_time.length;
         
          for (const layer_index of this.layers_cache) {
            for (const instance of this.layers[layer_index]) {
             if (instance !== undefined && instance.alive === true) {
                await instance.update();
                for (const element of instance.draw_call()) {
                  if (element.graphics !== undefined) {
                    element.draw();
                    this.stage.addChild(element.graphics);
                  } else {
                    this.stage.addChild(element);
                  }
                }
              }
            }
          }

          if (this.debug === true) {
            this.debug_text.text = this.fps;
            this.stage.addChild(this.debug_text);
          }
          
          this.renderer.render(this.stage);
          if (this.debug === true) {
            this.stage.removeChild(this.debug_text);
          }
          
          for (const layer_index of this.layers_cache) {
            for (const instance of this.layers[layer_index]) {
              if (instance !== undefined) {
                for (const element of instance.draw_call()) {
                  if (element.graphics !== undefined) {
                    this.stage.removeChild(element.graphics);
                  } else {
                    this.stage.removeChild(element);
                  }
                }
              }
            }
          }
        } catch(err) {
          alert(err);
          reject(err);
        }
        resolve();
      });
    });
  }
  
  
  instance_create(object, x = 0, y = 0, depth = 1) {
    const ins = new object();
    if (this.layers[depth] === undefined) {
      this.layers[depth] = [];
      this.layers_cache.push(depth);
      this.layers_cache.sort((a, b) => a < b);
    }
    const id = this.layers[depth].push(ins);
    ins.init(id, depth, x, y);
    ins.create();
    return ins;
  }
  
  instance_destroy(ins) {
    ins.alive = false;
    this.layers[ins.depth][ins.id] = undefined;
  }
}


class ArtistObject {
  constructor() {
    this.alive = false;
  }
  init(id, depth, x, y) {
    this.alive = true;
    this.id = id;
    this.depth = depth;
    this.x = x;
    this.y = y;
  }
  create() {}
  update() {}
  draw_call() {
    return [];
  }
}