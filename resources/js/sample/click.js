import { set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { lengthdir_x } from './math.js';

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
    this.sprite_name = 'stand';
    this.x = window.variables.display_width / 2;
    this.y = window.variables.display_height / 2;
    this.target_x = this.x;
    this.target_y = this.y;
    this.collider_width = 500;
    this.collider_height = 500;
    this.clicked = false;
    this.angle = 0;
    this.scale = 0;
    this.wiggle = 0;
    this.z = 0;
  }
  
  update() {
    if (window.variables.mouse_click === true) {
      if (this.clicked === true) {
        this.sprite_name = 'helpme';
        this.target_x = window.variables.mouse_x;
        this.target_y = window.variables.mouse_y - 50;
        this.scale += (0.4 - this.scale) / 5;
        this.wiggle += 8;
        this.wiggle = this.wiggle % 360;
        this.angle = lengthdir_x(20, this.wiggle);
      }      
    } else {
      this.sprite_name = 'stand';
      this.scale += (0.3 - this.scale) / 5;
      this.wiggle = 0;
      this.angle += (0 - this.angle) / 8;
      this.z = this.y;
      this.clicked = false;
    }
    
    this.x += (this.target_x - this.x) / 5;
    this.y += (this.target_y - this.y) / 5;
  }
  
  draw() {
    draw_sprite_ext(
      this.x,
      this.y,
      this.sprite_name,
      'center',
      this.scale,
      this.scale,
      this.angle
    );
   
    
    draw_set_color(color.red);
    draw_rectangle(
      this.x - this.collider_width / 2,
      this.y - this.collider_height / 2,
      this.x + this.collider_width / 2,
      this.y + this.collider_height / 2,
      false);
    draw_set_color(color.black);
  }
  
  pressed_me() {
    this.clicked = true;
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

instance_create(Neko, 0, 0, 1);
instance_create(MousePointer, 0, 0, 2);


} catch(err) {
  alert(err);
}