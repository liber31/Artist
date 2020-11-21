import { set_fps, set_canvas, set_debug_mode, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { draw_set_filter, draw_rectangle, draw_text_transformed, draw_set_font, sprite_load, draw_sprite, draw_line, draw_text, draw_circle, draw_set_alpha, draw_set_color, color, draw_sprite_ext } from './draw.js';
import { set_fullscreen } from './device.js';
import { point_direction, lengthdir_x, lengthdir_y, random_range, irandom_range, ease_in_out_expo } from './math.js';

const canvas = document.getElementById('canvas');

const text_array = ['안녕하세요', 'Hello','こんにちは','你好','Xin chào','Ciao','Guten Tag','Hola','Hej','salve','Apa kabar','merhaba','Habari za kucha','Сайн байна уу','Здравствуйте','mirëmëngjes','Bonjour'];
try {
set_canvas(canvas);
set_fullscreen(true);
set_debug_mode(true);
set_fps(60);

start();
setTimeout(() => {
  instance_create(MousePointer, 0, 0, 1);
  let index = 0;
  setInterval(() => {
    const text = instance_create(Texts, 0, 0, 2);
    text.text = text_array[index];
    index++;
    index %= text_array.length;
  }, 1000);
}, 0);

} catch(err) {
  alert(err);
}

class Texts extends ArtistElement {
  create() {
    this.size = irandom_range(1, 5);
    this.text = '안녕하세요';
    this.position_x = 1300;
    this.position_y = irandom_range(0,1000);
    this.alpha = 0;
    this.target_alpha = random_range(0.2, 0.8);
  }
  
  update() {
    this.x = (window.variables.display_width / 1000) * this.position_x;
    this.y = (window.variables.display_height / 1000) * this.position_y;
    this.alpha += (this.target_alpha - this.alpha) / 30;
    this.position_x -= window.variables.delta_time * 300;
    
    if (this.x < -window.variables.display_width) {
      instance_destroy(this);
    }
  }
  
  draw() {
    draw_set_alpha(this.alpha);
    draw_set_color(color.black);
    draw_set_font(
      100 * window.variables.display_ratio * this.size,
      'Arial');
    draw_text_transformed(
      this.x,
      this.y,
      this.text,
      'center',
      0
      );
    draw_set_alpha(1);
  }
}

// 마우스 좌표를 알기 위한 목적으로 만든 클래스
class MousePointer extends ArtistElement {
  draw() {
    if (window.variables.mouse_click === true) {
      draw_set_alpha(0.6);
      draw_set_color(color.black);
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