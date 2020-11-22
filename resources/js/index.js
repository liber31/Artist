import { set_fps, set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_set_filter, draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { point_direction, lengthdir_x, lengthdir_y, random_range, irandom_range, ease_in_out_expo } from './math.js';

const canvas = document.getElementById('canvas');

let gameArray = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ],
];
const arrayWidth = gameArray[0].length;
const arrayHeight = gameArray.length;
let finished = false;

set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(true);
set_fps(60);

start();
try {
class Wallpaper extends ArtistElement {
  create() {
    this.alpha = 0;
    this.time = 0;
    this.max_time = 40;
  }
  
  update() {
    this.time += 20 * window.variables.delta_time;
    this.time = Math.min(this.time, this.max_time);
    this.alpha = ease_in_out_expo(this.time / this.max_time);
  }
  
  draw() {
    draw_set_color(color.black);
    draw_set_alpha(this.alpha);
    draw_rectangle(0, 0, window.variables.display_width, window.variables.display_height, true);
    draw_set_alpha(1);
  }
}

class CongratulationEffect extends ArtistElement {
  create() {
    this.alpha = 0;
    this.time = 0;
    this.max_time = 40;
  }

  update() {
    this.time += 20 * window.variables.delta_time;
    this.time = Math.min(this.time, this.max_time);
    this.alpha = ease_in_out_expo(this.time / this.max_time);
  }

  draw() {
    draw_set_color(color.white);
    draw_set_alpha(this.alpha);
    draw_rectangle(0, 0, window.variables.display_width, window.variables.display_height, true);
    draw_set_alpha(1);
  }
}

function reverse(array, x, y) {
  let ins = null;
  try {
    ins = array[y][x];
    ins.enable = !ins.enable;
    ins.bounceSize = 1;
  } catch(_err) {}
}

function checkGameFinished() {
  for (let x = 0; x < arrayWidth; x++) {
    for (let y = 0; y < arrayHeight; y++) {
      try {
        if (gameArray[y][x].enable === false) {
          return;
        }
      } catch(err) {}
    }
  }
  
  finished = true;
  setTimeout(() => {
    instance_create(CongratulationEffect, 0, 0, 2);
  }, 500);
}

class Rectangle extends ArtistElement {
  create() {
    this.array_x = 0;
    this.array_y = 0;
    this.enable = false;
    this.alpha = 0;
    this.time = 0;
    this.maxTime = 30;
    this.targetSize = 0;
    this.size = 5;
    this.bounceSize = 0;
  }
  
  pressed_me() {
    if (finished === true) {
      return;
    }
    this.enable = !this.enable;
    this.bounceSize = 1;
    
    reverse(gameArray, this.array_x - 1, this.array_y);
    reverse(gameArray, this.array_x, this.array_y - 1);
    reverse(gameArray, this.array_x + 1, this.array_y);
    reverse(gameArray, this.array_x, this.array_y + 1);
    checkGameFinished();
  }
  
  update() {
    const maxLength = window.variables.display_height > window.variables.display_width? window.variables.display_width : window.variables.display_height;
    this.targetSize = (maxLength / arrayWidth);
    this.bounceSize += (0 - this.bounceSize) * 12 * window.variables.delta_time;
    this.size = this.targetSize;
    this.time += 20 * window.variables.delta_time;
    this.time = Math.min(this.time, this.maxTime);
    this.alpha = ease_in_out_expo(this.time / this.maxTime);
    
    this.x = window.variables.display_width / 2 - (this.size * arrayWidth) / 2 + (this.size) * this.array_x+ this.size / 2;
    this.y = window.variables.display_height / 2 - (this.size * arrayHeight) / 2 + (this.size) * this.array_y + this.size / 2;
    this.collider_width = this.size;
    this.collider_height = this.size;
  }
  
  draw() {
    this.size *= 0.4;
    this.size += this.size * this.bounceSize;
    draw_set_color(color.white);
    if (this.enable === false) {
      draw_set_alpha(this.alpha * 0.1);
      draw_rectangle(
        this.x - this.size * this.alpha,
        this.y - this.size * this.alpha,
        this.x + this.size * this.alpha,
        this.y + this.size * this.alpha,
        true);
    }
    draw_set_alpha(this.alpha);
    draw_rectangle(
      this.x - this.size * this.alpha,
      this.y - this.size * this.alpha,
      this.x + this.size * this.alpha,
      this.y + this.size * this.alpha,
      this.enable);
    draw_set_alpha(1);
  }
}

instance_create(Wallpaper, 0, 0, 0);

setTimeout(() => {
  for (let x = 0; x < arrayWidth; x++) {
    for (let y = 0; y < arrayHeight; y++) {
      if (gameArray[y][x] === -1 || gameArray[y][x] === undefined) {
        continue;
      }
      const rect = instance_create(Rectangle, 0, 0, -1);
      rect.array_x = x;
      rect.array_y = y;
      
      if (gameArray[y][x] === 1) {
        rect.enable = true;
      }
      
      gameArray[y][x] = rect;
    }
  }
}, 1000);

} catch(err) {
  alert(err);
}