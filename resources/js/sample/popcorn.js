import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawRectangle, drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color, drawSpriteExt } from './draw.js';
import { set_FULLSCREEN } from './device.js';
import { lengthdir_x, random_range, irandom_range, ease_in_out_expo } from './math.js';


const canvas = document.getElementById('canvas');

try {
  set_canvas(canvas);
  set_FULLSCREEN(true);
  set_DEBUG_MODE(false);

  start();

  spriteLoad('http://localhost:3000/image/popcorn.png', 'popcorn');
  spriteLoad('http://localhost:3000/image/popcorn_piece.png', 'popcorn_piece');

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
      if (this.y > window.variables.DISPLAY_HEIGHT) {
        this.y = window.variables.DISPLAY_HEIGHT + 50;
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
      drawSetAlpha(this.alpha);
      drawSpriteExt(
        this.x,
        this.y,
        'popcorn_piece',
        'center',
        this.scale,
        this.scale,
        this.angle
      );
      drawSetAlpha(1);
    }
  }

  class PopcornBox extends ArtistElement {
    create() {
      this.scale = 0;
      this.scale_time = 0;
      this.scale_time_max = 50;
      this.angle = 0;
      this.can_control = false;
      this.collider_WIDTH = 400;
      this.collider_HEIGHT = 600;
      this.pressed = false;
      this.beforeWidth = window.variables.DISPLAY_WIDTH;
      this.beforeHeight = window.variables.DISPLAY_HEIGHT;
    }

    pressed_me() {
      if (this.can_control === true) {
        this.pressed = true;
      }
    }

    update() {
      if (this.beforeWidth !== window.variables.DISPLAY_WIDTH
        || this.beforeHeight !== window.variables.DISPLAY_HEIGHT) {
        this.beforeWidth = window.variables.DISPLAY_WIDTH;
        this.beforeHeight = window.variables.DISPLAY_HEIGHT;
        this.x = window.variables.DISPLAY_WIDTH / 2 + 50;
        this.y = window.variables.DISPLAY_HEIGHT / 2;
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
          if (window.variables.MOUSE_CLICK === false) {
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
      drawSpriteExt(
        this.x,
        this.y,
        'popcorn',
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
      drawSetFont(50 * this.scale, 'Arial');
      drawTextTransformed(
        window.variables.DISPLAY_WIDTH / 2,
        window.variables.DISPLAY_HEIGHT - 120,
        'MAKE SOME POPCORNS',
        'center',
        0
      );

      drawSetFont(20 * this.scale, 'Arial');
      drawTextTransformed(
        window.variables.DISPLAY_WIDTH / 2,
        window.variables.DISPLAY_HEIGHT - 70,
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
  instance_create(PopcornBox, window.variables.DISPLAY_WIDTH / 2 + 50, window.variables.DISPLAY_HEIGHT / 2, 2);

} catch (err) {
  alert(err);
}