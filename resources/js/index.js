import { set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { lengthdir_x, random_range, irandom_range } from './math.js';
import {
  ease_in_quad,
  ease_out_quad,
  ease_in_out_quad,
  ease_in_cubic,
  ease_out_cubic,
  ease_in_out_cubic,
  ease_in_quartic,
  ease_out_quartic,
  ease_in_out_quartic,
  ease_in_quintic,
  ease_out_quintic,
  ease_in_out_quintic,
  ease_in_sine,
  ease_out_sine,
  ease_in_out_sine,
  ease_in_expo,
  ease_out_expo,
  ease_in_out_expo,
  ease_in_circ,
  ease_out_circ,
  ease_in_out_circ,
  ease_in_elastic,
  ease_out_elastic,
  ease_in_out_elastic,
  ease_in_back,
  ease_out_back,
  ease_in_out_back,
  ease_in_bounce,
  ease_out_bounce,
  ease_in_out_bounce
} from './math.js'

const easingFunctions = [
  ease_in_quad,
  ease_out_quad,
  ease_in_out_quad,
  ease_in_cubic,
  ease_out_cubic,
  ease_in_out_cubic,
  ease_in_quartic,
  ease_out_quartic,
  ease_in_out_quartic,
  ease_in_quintic,
  ease_out_quintic,
  ease_in_out_quintic,
  ease_in_sine,
  ease_out_sine,
  ease_in_out_sine,
  ease_in_expo,
  ease_out_expo,
  ease_in_out_expo,
  ease_in_circ,
  ease_out_circ,
  ease_in_out_circ,
  ease_in_elastic,
  ease_out_elastic,
  ease_in_out_elastic,
  ease_in_back,
  ease_out_back,
  ease_in_out_back,
  ease_in_bounce,
  ease_out_bounce,
  ease_in_out_bounce
  ];

const canvas = document.getElementById('canvas');

try {
set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(false);

start();

sprite_load('http://localhost:3000/image/stand.png', 'stand');
sprite_load('http://localhost:3000/image/helpme.png', 'helpme');

class Neko extends ArtistElement {
  create() {
    this.x = 0;
    this.y = 0;
    this.sprite_name = 'helpme';
    this.scale =0.15;
    this.collider_width = 1024 * this.scale;
    this.collider_height = 1024 * this.scale;
    this.max_time = 120;
    this.time = 0;
    this.easingIndex = 0;
    this.text_time = 0;
    this.text_max_time = 30;
    this.angle = 0;
    this.angle_time = 0;
  }
 
  update() {
    if (this.time < this.max_time) {
      this.time++;
      instance_create(CirclePoint, this.x, this.y, 2)
    } else {
      this.text_time = 0;
      this.time = 0;
      this.easingIndex++;
      instance_destroy('CirclePoint');
      if (this.easingIndex >= easingFunctions.length) {
        this.easingIndex = 0;
      }
    }
    
    if (this.text_time < this.text_max_time) {
      this.text_time++;
    }    
    this.x = (window.variables.display_width / this.max_time) * this.time;
    this.y = (window.variables.display_height - 400) * easingFunctions[this.easingIndex](this.time / this.max_time);
    this.angle_time+=5;
    this.angle_time = this.angle_time % 360;
    this.angle = lengthdir_x(10, this.angle_time);
  }
  
  draw() {
    draw_sprite_ext(
      this.x,
      this.y - this.collider_height / 1.45,
      this.sprite_name,
      'center',
      this.scale,
      this.scale,
      this.angle
    );
  
    draw_set_font(
      10 + 40 * ease_in_out_expo(this.text_time / this.text_max_time),
      'Arial'
    );
    draw_text_transformed(
      window.variables.display_width / 2,
      window.variables.display_height - 150,
      easingFunctions[this.easingIndex].name,
      'center',
      0
    );
    
    draw_set_font(
      20 * ease_in_out_expo(this.text_time / this.text_max_time),
      'Arial'
    );
    draw_text_transformed(
      window.variables.display_width / 2,
      window.variables.display_height - 90,
      String(this.easingIndex + 1) + '번째',
      'center',
      0
    );
    draw_set_font(25, 'Arial');
    
    draw_line(0, window.variables.display_height - 400, window.variables.display_width, window.variables.display_height - 400);
    
    draw_text(10, window.variables.display_height - 380, '시간 흐름에 따른 y값 변화')
  }
}


class MousePointer extends ArtistElement {
  draw() {
    if (window.variables.mouse_click === true) {
      draw_set_alpha(0.6);
      draw_circle(window.variables.mouse_x, window.variables.mouse_y, 3, true);
      draw_line(0, window.variables.mouse_y, window.variables.display_width, window.variables.mouse_y);
      draw_line(window.variables.mouse_x, 0, window.variables.mouse_x, window.variables.display_height);
       draw_set_alpha(1);
    }
  }
}


class CirclePoint extends ArtistElement {
  draw() {
    draw_set_color(color.red);
    draw_circle(this.x, this.y, 3, true);
    draw_set_color(color.black);
  }
}

instance_create(MousePointer, 0, 0, 3);
instance_create(Neko, 0, 0, 2);

} catch(err) {
  alert(err);
}