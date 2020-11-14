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
  instance_create(Wallpaper, 0, 0, 1);
  instance_create(MousePointer, 0, 0, 4);
  
  setTimeout(() => {
    instance_create(Introduce, 0, 0, 3);
    
    setInterval(() => {
    instance_create(FireCore, 
    window.variables.display_width / 2, 
    window.variables.display_height, 2);
    }, 3000);
  }, 1000);
}, 1);

} catch(err) {
  alert(err);
}

class FireCore extends ArtistElement {
  create() {
    this.power = -(window.variables.display_height / 2) / 25;
    this.power_width = irandom_range(-10, 10);
    
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        instance_create(FireBall, this.x, this.y, 2);
      }
      instance_destroy(this);
    }, 1200);
  }
  
  draw() {
    this.y += this.power;
    this.power += 0.5
    this.x += this.power_width;
    this.power_width += (0 - this.power_width) / 30;
    draw_set_color(color.white);
    draw_circle(
      this.x,
      this.y,
      7,
      true
     );
     draw_set_color(color.black);
  }
}


class FireBall extends ArtistElement {
  create() {
    this.target_angle = irandom_range(0, 360);
    this.target_x = lengthdir_x(irandom_range(100, 800), this.target_angle);
    this.target_y = lengthdir_y(irandom_range(100, 600), this.target_angle);
    this.start_x = this.x;
    this.start_y = this.y;
    this.size = irandom_range(2, 10);
    this.alpha = irandom_range(4, 10);
    this.time = 0;
    this.max_time = 20;
    
    setTimeout(() => {
      instance_destroy(this);
    }, 3000);
  }
  
  draw() {
    this.time++;
    this.time = Math.min(this.max_time, this.time);
    if (this.time === this.max_time) {
      this.target_y += 3;
    }
    this.x += ((this.target_x + this.start_x) - this.x) / 25;
    this.y += ((this.target_y + this.start_y) - this.y) / 20;
   
    this.alpha -= 0.05;
    
    draw_set_color(color.white);
    draw_set_alpha(Math.min(Math.max(0, this.alpha), 1));
    draw_circle(
      this.x,
      this.y,
      this.size,
      true
     );
     
     draw_set_alpha(1);
     draw_set_color(color.black);
  }
}


class Introduce extends ArtistElement {
  create() {
    this.time = 0;
    this.max_time = 50;
    this.angle = 0;
  }
  
  draw() {
    this.time++;
    this.time = Math.min(this.max_time, this.time);
    this.angle = ease_in_out_expo(this.time / this.max_time) * 180 + 180;
    
    draw_set_font(50, 'Arial');
    draw_set_color(color.white);
    draw_text_transformed(
      window.variables.display_width / 2,
      window.variables.display_height - 200 * ease_in_out_expo(this.time / this.max_time) + 50,
      'Firework!',
      'center',
      this.angle);
    draw_set_color(color.black);
  }
}

class Wallpaper extends ArtistElement {
  create() {
    this.alpha = 0;
    this.time = 0;
    this.max_time = 50;
  }
  
  draw() {
    this.time++;
    this.time = Math.min(this.max_time, this.time);
    this.alpha = 0.8 * ease_in_out_expo(this.time / this.max_time);
    
    draw_set_alpha(this.alpha);
    draw_set_color(color.black);
    draw_rectangle(
      0,
      0,
      window.variables.display_width,
      window.variables.display_height,
      true);
    draw_set_alpha(1);
  }
}

// 마우스 좌표를 알기 위한 목적으로 만든 클래스
class MousePointer extends ArtistElement {
  draw() {
    if (window.variables.mouse_click === true) {
      draw_set_alpha(0.6);
      draw_set_color(color.white);
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