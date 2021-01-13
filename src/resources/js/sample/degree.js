import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color, drawSpriteExt } from './draw.js';
import { set_FULLSCREEN } from './device.js';

const canvas = document.getElementById('canvas');

try {
  set_canvas(canvas);
  set_FULLSCREEN(true);
  set_DEBUG_MODE(false);

  start();

  spriteLoad(`https://rhea-so.github.io/Artist/product//img/char_snow_run_0.png`, `char`);

  class MousePointer extends ArtistElement {
    draw() {
      drawSetAlpha(0.6);
      drawCircle(window.variables.MOUSE_X, window.variables.MOUSE_Y, 3, true);
      drawLine(0, window.variables.MOUSE_Y, window.variables.DISPLAY_WIDTH, window.variables.MOUSE_Y);
      drawLine(window.variables.MOUSE_X, 0, window.variables.MOUSE_X, window.variables.DISPLAY_HEIGHT);
      drawSetAlpha(1);
    }
  }

  class Base extends ArtistElement {
    draw() {
      drawSetAlpha(0.3);
      drawCircle(window.variables.DISPLAY_WIDTH / 2, window.variables.DISPLAY_HEIGHT / 2, 5, true);
      drawLine(0, window.variables.DISPLAY_HEIGHT / 2, window.variables.DISPLAY_WIDTH, window.variables.DISPLAY_HEIGHT / 2);
      drawLine(window.variables.DISPLAY_WIDTH / 2, 0, window.variables.DISPLAY_WIDTH / 2, window.variables.DISPLAY_HEIGHT);
      drawSetAlpha(1);
    }
  }

  class Machine extends ArtistElement {
    create() {
      this.angle = 0;
    }

    update() {
      this.angle = point_direction(window.variables.DISPLAY_WIDTH / 2, window.variables.DISPLAY_HEIGHT / 2, window.variables.MOUSE_X, window.variables.MOUSE_Y);
      this.dist = point_distance(window.variables.DISPLAY_WIDTH / 2, window.variables.DISPLAY_HEIGHT / 2, window.variables.MOUSE_X, window.variables.MOUSE_Y);
    }

    draw() {
      drawSetColor(color.red);
      drawLine(window.variables.DISPLAY_WIDTH / 2, window.variables.DISPLAY_HEIGHT / 2, window.variables.MOUSE_X, window.variables.MOUSE_Y);
      drawSetFont(25, 'Arial');
      drawText(window.variables.DISPLAY_WIDTH / 2 + 7, window.variables.DISPLAY_HEIGHT / 2 + 12, String(Math.round(this.angle)) + ' degree.');
      drawCircle(
        window.variables.DISPLAY_WIDTH / 2 + lengthdir_x(this.dist, this.angle),
        window.variables.DISPLAY_HEIGHT / 2 + lengthdir_y(this.dist, this.angle),
        5,
        true
      )

      drawSetFont(50, 'Arial');
      drawTextTransformed(window.variables.DISPLAY_WIDTH / 2 - 150, window.variables.DISPLAY_HEIGHT / 2 + 200, 'Text Angle', 'center', this.angle);
      drawSetColor(color.black);
      drawSpriteExt(window.variables.MOUSE_X, window.variables.MOUSE_Y, 'char', 'center', 1, 1, this.angle);
    }
  }

  instance_create(MousePointer, 0, 0, 1);
  instance_create(Base, 0, 0, 1);
  instance_create(Machine, 0, 0, 1);

} catch (err) {
  alert(err);
}
















// ETC
