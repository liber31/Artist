import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawRectangle, drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color, drawSpriteExt } from './draw.js';
import { set_FULLSCREEN } from './device.js';
import { point_direction, lengthdir_x, lengthdir_y, random_range, irandom_range, ease_in_out_expo } from './math.js';

const canvas = document.getElementById('canvas');

try {
  set_canvas(canvas);
  set_FULLSCREEN(true);
  set_DEBUG_MODE(true);

  start();
  setTimeout(() => {
    instance_create(MousePointer, 0, 0, 1);
    instance_create(RainbowRectangle, 0, 0, 2);
  }, 0);

} catch (err) {
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
    switch (this.update_trigger) {
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
    drawSetColor(`rgb(${this.red}, ${this.green}, ${this.blue})`);
    drawRectangle(0, 0, window.variables.DISPLAY_WIDTH, window.variables.DISPLAY_HEIGHT, true);
    drawSetColor(color.black);
  }
}

// 마우스 좌표를 알기 위한 목적으로 만든 클래스
class MousePointer extends ArtistElement {
  draw() {
    if (window.variables.MOUSE_CLICK === true) {
      drawSetAlpha(0.6);
      drawSetColor('rgb(255, 0, 0)');
      drawCircle(
        window.variables.MOUSE_X,
        window.variables.MOUSE_Y,
        3,
        true);

      drawLine(
        0,
        window.variables.MOUSE_Y,
        window.variables.DISPLAY_WIDTH,
        window.variables.MOUSE_Y);

      drawLine(
        window.variables.MOUSE_X,
        0,
        window.variables.MOUSE_X,
        window.variables.DISPLAY_HEIGHT);
      drawSetAlpha(1);
      drawSetColor(color.black);
    }
  }
}