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
		for (let depth = 0; depth < 5; depth++) {
			instance_create(Rectangle, 100 + depth * 30, 100 + depth * 30, depth);
		}
	}, 0);

} catch (err) {
	alert(err);
}

class Rectangle extends ArtistElement {
	create() {
		this.size = 60;
	}

	draw() {
		drawSetColor(color.white);
		drawRectangle(this.x - this.size, this.y - this.size, this.x + this.size, this.y + this.size, true);
		drawSetColor(color.black);
		drawRectangle(this.x - this.size, this.y - this.size, this.x + this.size, this.y + this.size, false);
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