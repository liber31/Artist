import { set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { point_direction, lengthdir_x, lengthdir_y, random_range, irandom_range, ease_in_out_expo } from './math.js';

const canvas = document.getElementById('canvas');

try {
set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(true);

start();
setTimeout(() => {
  instance_create(MousePointer, 0, 0, 1);
  instance_create(RainbowRectangle, 0, 0, 2);
}, 0);

} catch(err) {
  alert(err);
}

class RainbowRectangle extends ArtistElement {
  create() {
    this.red = 255;
    this.green = 0;
    this.blue = 0;
    this.update_trigger = 0;
    this.time = 0;
    this.max_time = 60;
  }
  
  update() {
    this.time++;
    switch(this.update_trigger) {
      case 0:
        this.red += (255 - this.red) / 30;
        this.green += (0 - this.green) / 30;
        this.blue += (0 - this.blue) / 30;
        break;
      
      case 1:
        this.red += (255 - this.red) / 30;
        this.green += (255 - this.green) / 30;
        this.blue += (0 - this.blue) / 30;
        break;
        
      case 2:
        this.red += (0 - this.red) / 30;
        this.green += (255 - this.green) / 30;
        this.blue += (0 - this.blue) / 30;
        break;
        
      case 3:
        this.red += (0 - this.red) / 30;
        this.green += (255 - this.green) / 30;
        this.blue += (255 - this.blue) / 30;
        break;
      
      case 4:
        this.red += (0 - this.red) / 30;
        this.green += (0 - this.green) / 30;
        this.blue += (255 - this.blue) / 30;
        break;
      
      case 5:
        this.red += (255 - this.red) / 30;
        this.green += (0 - this.green) / 30;
        this.blue += (255 - this.blue) / 30;
        break;        
    }
    
    if (this.time === this.max_time) {
      this.update_trigger++;
      this.update_trigger = this.update_trigger % 6;
      this.time = 0;
    }
  }
  
  draw() {
    draw_set_color(`rgb(${this.red}, ${this.green}, ${this.blue})`);
    draw_rectangle(0, 0, window.variables.display_width, window.variables.display_height, true);
    draw_set_color(color.black);
  }
}

// 마우스 좌표를 알기 위한 목적으로 만든 클래스
class MousePointer extends ArtistElement {
  draw() {
    if (window.variables.mouse_click === true) {
      draw_set_alpha(0.6);
      draw_set_color('rgb(255, 0, 0)');
      draw_circle(
        window.variables.mouse_x,
        window.variables.mouse_y,
        3,
        true);
      
      draw_line(
        0,
        window.variables.mouse_y,
        window.variables.display_width,
        window.variables.mouse_y);
        
      draw_line(
        window.variables.mouse_x,
        0,
        window.variables.mouse_x,
        window.variables.display_height);
       draw_set_alpha(1);
       draw_set_color(color.black);
    }
  }
}