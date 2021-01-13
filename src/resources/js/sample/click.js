import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawRectangle, drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color, drawSpriteExt } from './draw.js';
import { set_FULLSCREEN } from './device.js';
import { lengthdir_x } from './math.js';

const canvas = document.getElementById('canvas');

try {
  set_canvas(canvas);
  set_FULLSCREEN(true);
  set_DEBUG_MODE(false);

  start();

  spriteLoad('http://localhost:3000/image/stand.png', 'stand');
  spriteLoad('http://localhost:3000/image/helpme.png', 'helpme');

  class Neko extends ArtistElement {
    create() {
      this.sprite_name = 'stand';
      this.x = window.variables.DISPLAY_WIDTH / 2;
      this.y = window.variables.DISPLAY_HEIGHT / 2;
      this.target_x = this.x;
      this.target_y = this.y;
      this.collider_WIDTH = 500;
      this.collider_HEIGHT = 500;
      this.clicked = false;
      this.angle = 0;
      this.scale = 0;
      this.wiggle = 0;
      this.z = 0;
    }

    update() {
      if (window.variables.MOUSE_CLICK === true) {
        if (this.clicked === true) {
          this.sprite_name = 'helpme';
          this.target_x = window.variables.MOUSE_X;
          this.target_y = window.variables.MOUSE_Y - 50;
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
      drawSpriteExt(
        this.x,
        this.y,
        this.sprite_name,
        'center',
        this.scale,
        this.scale,
        this.angle
      );


      drawSetColor(color.red);
      drawRectangle(
        this.x - this.collider_WIDTH / 2,
        this.y - this.collider_HEIGHT / 2,
        this.x + this.collider_WIDTH / 2,
        this.y + this.collider_HEIGHT / 2,
        false);
      drawSetColor(color.black);
    }

    pressed_me() {
      this.clicked = true;
    }
  }


  class MousePointer extends ArtistElement {
    draw() {
      if (window.variables.MOUSE_CLICK === true) {
        drawSetAlpha(0.6);
        drawCircle(window.variables.MOUSE_X, window.variables.MOUSE_Y, 3, true);
        drawLine(0, window.variables.MOUSE_Y, window.variables.DISPLAY_WIDTH, window.variables.MOUSE_Y);
        drawLine(window.variables.MOUSE_X, 0, window.variables.MOUSE_X, window.variables.DISPLAY_HEIGHT);
        drawSetAlpha(1);
      }
    }
  }

  instance_create(Neko, 0, 0, 1);
  instance_create(MousePointer, 0, 0, 2);


} catch (err) {
  alert(err);
}