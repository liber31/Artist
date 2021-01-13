import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawRectangle, drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color, drawSpriteExt } from './draw.js';
import { set_FULLSCREEN } from './device.js';
import { lengthdir_x, random_range, irandom_range } from './math.js';
import {
	ease_in_quad,
	ease_out_quad,
	ease_in_out_quad,
	ease_in_cubic,
	ease_out_cubic,
	ease_in_out_cubic,
	ease_in_quartic,
	ease_out_quartic,
	ease_in_out_quartic,
	ease_in_quintic,
	ease_out_quintic,
	ease_in_out_quintic,
	ease_in_sine,
	ease_out_sine,
	ease_in_out_sine,
	ease_in_expo,
	ease_out_expo,
	ease_in_out_expo,
	ease_in_circ,
	ease_out_circ,
	ease_in_out_circ,
	ease_in_elastic,
	ease_out_elastic,
	ease_in_out_elastic,
	ease_in_back,
	ease_out_back,
	ease_in_out_back,
	ease_in_bounce,
	ease_out_bounce,
	ease_in_out_bounce
} from './math.js'

const easingFunctions = [
	ease_in_quad,
	ease_out_quad,
	ease_in_out_quad,
	ease_in_cubic,
	ease_out_cubic,
	ease_in_out_cubic,
	ease_in_quartic,
	ease_out_quartic,
	ease_in_out_quartic,
	ease_in_quintic,
	ease_out_quintic,
	ease_in_out_quintic,
	ease_in_sine,
	ease_out_sine,
	ease_in_out_sine,
	ease_in_expo,
	ease_out_expo,
	ease_in_out_expo,
	ease_in_circ,
	ease_out_circ,
	ease_in_out_circ,
	ease_in_elastic,
	ease_out_elastic,
	ease_in_out_elastic,
	ease_in_back,
	ease_out_back,
	ease_in_out_back,
	ease_in_bounce,
	ease_out_bounce,
	ease_in_out_bounce
];

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
			this.x = 0;
			this.y = 0;
			this.sprite_name = 'helpme';
			this.scale = 0.15;
			this.collider_WIDTH = 1024 * this.scale;
			this.collider_HEIGHT = 1024 * this.scale;
			this.max_time = 120;
			this.time = 0;
			this.easingIndex = 0;
			this.text_time = 0;
			this.text_max_time = 30;
			this.angle = 0;
			this.angle_time = 0;
		}

		update() {
			if (this.time < this.max_time) {
				this.time++;
				instance_create(CirclePoint, this.x, this.y, 2)
			} else {
				this.text_time = 0;
				this.time = 0;
				this.easingIndex++;
				instance_destroy('CirclePoint');
				if (this.easingIndex >= easingFunctions.length) {
					this.easingIndex = 0;
				}
			}

			if (this.text_time < this.text_max_time) {
				this.text_time++;
			}
			this.x = (window.variables.DISPLAY_WIDTH / this.max_time) * this.time;
			this.y = (window.variables.DISPLAY_HEIGHT - 400) * easingFunctions[this.easingIndex](this.time / this.max_time);
			this.angle_time += 5;
			this.angle_time = this.angle_time % 360;
			this.angle = lengthdir_x(10, this.angle_time);
		}

		draw() {
			drawSpriteExt(
				this.x,
				this.y - this.collider_HEIGHT / 1.45,
				this.sprite_name,
				'center',
				this.scale,
				this.scale,
				this.angle
			);

			drawSetFont(
				10 + 40 * ease_in_out_expo(this.text_time / this.text_max_time),
				'Arial'
			);
			drawTextTransformed(
				window.variables.DISPLAY_WIDTH / 2,
				window.variables.DISPLAY_HEIGHT - 150,
				easingFunctions[this.easingIndex].name,
				'center',
				0
			);

			drawSetFont(
				20 * ease_in_out_expo(this.text_time / this.text_max_time),
				'Arial'
			);
			drawTextTransformed(
				window.variables.DISPLAY_WIDTH / 2,
				window.variables.DISPLAY_HEIGHT - 90,
				String(this.easingIndex + 1) + '번째',
				'center',
				0
			);
			drawSetFont(25, 'Arial');

			drawLine(0, window.variables.DISPLAY_HEIGHT - 400, window.variables.DISPLAY_WIDTH, window.variables.DISPLAY_HEIGHT - 400);

			drawText(10, window.variables.DISPLAY_HEIGHT - 380, '시간 흐름에 따른 y값 변화')
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


	class CirclePoint extends ArtistElement {
		draw() {
			drawSetColor(color.red);
			drawCircle(this.x, this.y, 3, true);
			drawSetColor(color.black);
		}
	}

	instance_create(MousePointer, 0, 0, 3);
	instance_create(Neko, 0, 0, 2);

} catch (err) {
	alert(err);
}