import { set_fps, set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_set_filter, draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { point_direction, lengthdir_x, lengthdir_y, random_range, irandom_range, ease_in_out_expo } from './math.js';

const canvas = document.getElementById('canvas');

set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(true);
set_fps(60);

start();

sprite_load('https://p1.hiclipart.com/path/447/925/142/cass0uq2qnhaf4vvgjrrtl1kec-844ebd8e21cf6b9be1ad883291c85d1e.png?dl=1', 'tree');

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
    draw_rectangle(0, 0, window.variables.display_width, window.variables.display_height, true);
    draw_set_alpha(0.5);
    draw_set_color(color.white);
    const fontSize = 100 * (window.variables.display_width / window.variables.display_height);
    draw_set_font(fontSize, 'Arial');
    draw_text_transformed(window.variables.display_width / 2, fontSize, '옷 따뜻하게 입고 다니세요', 'center', 0);
    draw_set_alpha(1);
    draw_sprite_ext(window.variables.display_width / 2, window.variables.display_height / 2, 'tree', 'center', 0.5, 0.5);
    
    draw_set_alpha(1 - this.alpha);
    draw_rectangle(0, 0, window.variables.display_width, window.variables.display_height, true);
    draw_set_alpha(1);
  }
}

class Snow extends ArtistElement {
  create() {    
    this.xstart = irandom_range(0, window.variables.display_width);
    this.r = irandom_range(2, 5);
    this.time = 0;    
    this.angle = irandom_range(0, 360);
  }
  
  update() {
    this.y = (window.variables.display_height / 100 / (5 - this.r) * this.time);
    this.time += 20 * window.variables.delta_time;
    this.angle = (this.angle + 2) % 360;
    this.x = this.xstart + lengthdir_x(this.r * 3, this.angle);
    if (this.y >= window.variables.display_height) {
      instance_destroy(this);
    }
  }
  
  draw() {
    draw_set_alpha(1);
    draw_set_color(color.white);
    draw_circle(this.x, this.y, this.r, true);
  }
}

setTimeout(() => {
  instance_create(Wallpaper, 0, 0, -1);
}, 2000);

setInterval(() => {
  instance_create(Snow, 0, 0, -2);
}, 100);