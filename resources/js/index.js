import { set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color } from './draw.js';
import { set_fullscreen } from './device.js';

try {
const canvas = document.getElementById('canvas');

set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(true);

start();

sprite_load(`https://rhea-so.github.io/Artist/product//img/farback.png`, `farback`);

class Sample extends ArtistElement {
  create() {
    this.sample = 'hi';
    this.count = 0;
  }
  
  update() {
    this.x = window.variables.mouse_x;
    this.y = window.variables.mouse_y;
  }
  
  draw() {
    draw_sprite(0, 0, 'farback');
    draw_set_color(color.green);
    draw_set_alpha(1);
    draw_text(this.x, this.y + 30, window.variables.keyboard_code + '  , ' + String(window.variables.keyboard_check) +'  '+ this.sample + ' clicked: ' + String(window.variables.mouse_click) + '   count: ' + String(this.count) + '  mouse_x: ' + String(this.x) + '   mouse_y: ' + String(this.y));
    draw_line(0, this.y, window.variables.display_width, this.y);
    draw_line(this.x, 0, this.x, window.variables.display_height);
    draw_circle(this.x, this.y, 10, true);
    draw_set_alpha(0.5);
    draw_set_color(color.black);
    draw_circle(this.x, this.y, 20, true);
    draw_set_alpha(1);
  }
  
  click_global() {
    this.sample = 'hello, world';
  }
  
  pressed_global() {
    this.count++;
  }
}

let ins = instance_create(Sample, 10, 10, 1);

} catch(err) {
  alert(err);
}

function lengthdir_x(dist, angle) {
    return dist * Math.cos(angle);
}

function lengthdir_y(dist, angle) {
    return dist * -Math.sin(angle);
}