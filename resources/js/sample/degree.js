import { set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';

const canvas = document.getElementById('canvas');

try {
set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(false);

start();

sprite_load(`https://rhea-so.github.io/Artist/product//img/char_snow_run_0.png`, `char`);

class MousePointer extends ArtistElement {
  draw() {
    draw_set_alpha(0.6);
    draw_circle(window.variables.mouse_x, window.variables.mouse_y, 3, true);
    draw_line(0, window.variables.mouse_y, window.variables.display_width, window.variables.mouse_y);
    draw_line(window.variables.mouse_x, 0, window.variables.mouse_x, window.variables.display_height);
    draw_set_alpha(1);
  }
}

class Base extends ArtistElement {
  draw() {
    draw_set_alpha(0.3);
    draw_circle(window.variables.display_width / 2, window.variables.display_height / 2, 5, true);
    draw_line(0, window.variables.display_height / 2 , window.variables.display_width, window.variables.display_height / 2);
    draw_line(window.variables.display_width / 2, 0, window.variables.display_width / 2, window.variables.display_height);
    draw_set_alpha(1);
  }
}

class Machine extends ArtistElement {
  create() {
    this.angle = 0;
  }
  
  update() {
    this.angle = point_direction(window.variables.display_width / 2, window.variables.display_height / 2, window.variables.mouse_x, window.variables.mouse_y);
    this.dist = point_distance(window.variables.display_width / 2, window.variables.display_height / 2, window.variables.mouse_x, window.variables.mouse_y);
  }
  
  draw() {
    draw_set_color(color.red);
    draw_line(window.variables.display_width / 2, window.variables.display_height / 2, window.variables.mouse_x, window.variables.mouse_y);
    draw_set_font(25, 'Arial');
    draw_text(window.variables.display_width / 2 + 7, window.variables.display_height / 2 + 12, String(Math.round(this.angle)) + ' degree.');
    draw_circle(
      window.variables.display_width / 2 + lengthdir_x(this.dist, this.angle),
      window.variables.display_height / 2 + lengthdir_y(this.dist, this.angle),
      5,
      true
    )
    
    draw_set_font(50, 'Arial');
    draw_text_transformed(window.variables.display_width / 2 - 150, window.variables.display_height / 2 + 200, 'Text Angle', 'center', this.angle);
    draw_set_color(color.black);
    draw_sprite_ext(window.variables.mouse_x, window.variables.mouse_y, 'char', 'center', 1, 1, this.angle);
  }
}

instance_create(MousePointer, 0, 0, 1);
instance_create(Base, 0, 0, 1);
instance_create(Machine, 0, 0, 1);

} catch(err) {
  alert(err);
}
















// ETC
