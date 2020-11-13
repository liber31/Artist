import { set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { lengthdir_x, random_range, irandom_range, ease_in_out_expo } from './math.js';


const canvas = document.getElementById('canvas');

try {
set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(false);

start();

sprite_load('http://localhost:3000/image/popcorn.png', 'popcorn');
sprite_load('http://localhost:3000/image/popcorn_piece.png', 'popcorn_piece');

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

class PopcornPiece extends ArtistElement {
  create() {
    this.scale = random_range(0.3, 1);
    this.angle = 0
    this.x += 20 + irandom_range(-100, 100);
    this.y += 50 + irandom_range(-300, 180);
    this.y_add = -30;
    this.x_add = random_range(-5, 5);
    this.alpha = 1;
  }
  
  update() {
    if (this.y > window.variables.display_height) {
      this.y = window.variables.display_height + 50;
      if (this.alpha >= 0.05) {
        this.alpha -= 0.02;
      } else {
        instance_destroy(this);
      }
    } else {
      this.y_add += 1;
      this.y += this.y_add;
      this.x += this.x_add;      
    }
  }
  
  draw() {
    draw_set_alpha(this.alpha);
    draw_sprite_ext(
      this.x,
      this.y,
      'popcorn_piece',
      'center',
      this.scale,
      this.scale,
      this.angle
    );
    draw_set_alpha(1);
  }
}

class PopcornBox extends ArtistElement {
  create() {
    this.scale = 0;
    this.scale_time = 0;
    this.scale_time_max = 50;
    this.angle = 0;
    this.can_control = false;
    this.collider_width = 400;
    this.collider_height = 600;
    this.pressed = false;
    this.beforeWidth = window.variables.display_width;
    this.beforeHeight = window.variables.display_height;
  }
  
  pressed_me() {
    if (this.can_control === true) {
      this.pressed = true;
    }
  }
  
  update() {
    if (this.beforeWidth !== window.variables.display_width
    || this.beforeHeight !== window.variables.display_height) {
      this.beforeWidth = window.variables.display_width;
      this.beforeHeight = window.variables.display_height;
      this.x = window.variables.display_width / 2 + 50;
      this.y = window.variables.display_height / 2;
    }
    
    if (this.can_control === false) {
      this.scale_time++;
      this.scale_time = Math.min(this.scale_time_max, this.scale_time);
      if (this.scale_time === this.scale_time_max) {
        this.can_control = true;
      }
      this.scale = ease_in_out_expo(this.scale_time / this.scale_time_max) * 0.8;
      this.angle = ease_in_out_expo(this.scale_time / this.scale_time_max) * -80 + 60;
    } else {
      if (this.pressed === true) {
        if (window.variables.mouse_click === false) {
          this.pressed = false;
          this.angle = 40;
          
          for (let i = 0; i < irandom_range(4, 20); i++) {
            instance_create(PopcornPiece, this.x - 100, this.y - 100, 2);
          }
          return;
        }
        this.scale += (0.7 - this.scale) / 8;
      } else {
        this.scale += (0.8 - this.scale) / 8;
      }
        this.angle += (-20 - this.angle) / 12;
    }
  }
  
  draw() {
    draw_sprite_ext(
      this.x,
      this.y,
      'popcorn',
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
}

class Introduce extends ArtistElement {
  create() {
    this.time = 0;
    this.max_time = 50;
    this.scale = 0;
  }
  
  update() {
    this.time++;
    this.time = Math.min(this.max_time, this.time);
    this.scale = ease_in_out_expo(this.time / this.max_time);
  }
  
  draw() {
    draw_set_font(50 * this.scale, 'Arial');
    draw_text_transformed(
      window.variables.display_width / 2,
      window.variables.display_height - 120,
      'MAKE SOME POPCORNS',
      'center',
      0
    );
    
    draw_set_font(20 * this.scale, 'Arial');
    draw_text_transformed(
      window.variables.display_width / 2,
      window.variables.display_height - 70,
      'Click to make',
      'center',
      0
    );
  }
}


setTimeout(() => {
  instance_create(Introduce, 0, 0, 4);
}, 700);
instance_create(MousePointer, 0, 0, 3);
instance_create(PopcornBox, window.variables.display_width / 2 + 50, window.variables.display_height / 2, 2);

} catch(err) {
  alert(err);
}