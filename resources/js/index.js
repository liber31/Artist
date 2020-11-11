import { set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { lengthdir_x, random_range, irandom_range } from './math.js';

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
    this.sprite_name = 'helpme';
    this.x = irandom_range(-100, window.variables.display_width + 100);
    this.y = -300;
    this.scale = random_range(0.01, 0.12);
    this.target_x = this.x;
    this.target_y = this.y;
    this.target_scale = this.scale;
    this.collider_width = 1024 * this.scale;
    this.collider_height = 1024 * this.scale;
    this.clicked = false;
    this.angle = 0;
    this.wiggle = 0;
    this.wiggle_time = irandom_range(1, 4)
  }
  
  click_me() {
    if (this.sprite_name === 'helpme') {
      wallpaper.scale = 2;
      wallpaper.combo++;
      wallpaper.angle = irandom_range(-50, 50);
    }
    this.sprite_name = 'stand';
    this.target_scale = 0.001;
  }
  
  update() {
    this.angle++;
    this.wiggle += this.wiggle_time;
    this.wiggle = this.wiggle % 360;
    this.x = this.target_x + lengthdir_x(50, this.wiggle) - 25;
    this.scale += (this.target_scale - this.scale) / 8;
    this.collider_width = 1024 * this.scale;
    this.collider_height = 1024 * this.scale;
    if (this.scale < 0.003) {
      instance_destroy(this);
    }
    this.y += 4;
    if (this.y > window.variables.display_height + 100) {
      instance_destroy(this);
    }
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


class Wallpaper extends ArtistElement {
  create() {
    this.combo = 0;
    this.scale = 1;
    this.angle = 0;
  }
  
  update() {
    this.scale += (1 - this.scale) / 8;
    this.angle += (0 - this.angle) / 8;
  }
  
  draw() {
    draw_set_color(color.green);
    draw_rectangle(
      0,
      0,
      window.variables.display_width,
      window.variables.display_height,
      true
    );
    draw_set_color(color.black);
    draw_set_font(300 * this.scale, 'Arial');
    draw_text_transformed(
      window.variables.display_width / 2,
      window.variables.display_height / 2 - 80,
      this.combo,
      'center',
      this.angle
    )
      draw_set_font(50 * this.scale, 'Arial');
      draw_text_transformed(
      window.variables.display_width / 2,
      window.variables.display_height / 2 + 130,
      'combo',
      'center',
      this.angle
    )
  }
}

const wallpaper = instance_create(Wallpaper, 0, 0, 1);
instance_create(MousePointer, 0, 0, 3);

setInterval(
  () => {
    instance_create(Neko, 0, 0, 2);
  },
  100
)


} catch(err) {
  alert(err);
}