import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawRectangle, drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color, drawSpriteExt } from './draw.js';
import { set_FULLSCREEN } from './device.js';
import { point_direction, lengthdir_x, lengthdir_y, random_range, irandom_range, ease_in_out_expo } from './math.js';


const canvas = document.getElementById('canvas');

try {
	set_canvas(canvas);
	set_FULLSCREEN(true);
	set_DEBUG_MODE(false);

	start();

	setTimeout(() => {
		instance_create(Wallpaper, 0, 0, 1);
		instance_create(MousePointer, 0, 0, 4);

		setTimeout(() => {
			instance_create(Introduce, 0, 0, 3);

			setInterval(() => {
				instance_create(FireCore,
					window.variables.DISPLAY_WIDTH / 2,
					window.variables.DISPLAY_HEIGHT, 2);
			}, 3000);
		}, 1000);
	}, 1);

} catch (err) {
	alert(err);
}

class FireCore extends ArtistElement {
	create() {
		this.power = -(window.variables.DISPLAY_HEIGHT / 2) / 25;
		this.power_WIDTH = irandom_range(-10, 10);

		setTimeout(() => {
			for (let i = 0; i < 100; i++) {
				instance_create(FireBall, this.x, this.y, 2);
			}
			instance_destroy(this);
		}, 1200);
	}

	draw() {
		this.y += this.power;
		this.power += 0.5
		this.x += this.power_WIDTH;
		this.power_WIDTH += (0 - this.power_WIDTH) / 30;
		drawSetColor(color.white);
		drawCircle(
			this.x,
			this.y,
			7,
			true
		);
		drawSetColor(color.black);
	}
}


class FireBall extends ArtistElement {
	create() {
		this.target_angle = irandom_range(0, 360);
		this.target_x = lengthdir_x(irandom_range(100, 800), this.target_angle);
		this.target_y = lengthdir_y(irandom_range(100, 600), this.target_angle);
		this.start_x = this.x;
		this.start_y = this.y;
		this.size = irandom_range(2, 10);
		this.alpha = irandom_range(4, 10);
		this.time = 0;
		this.max_time = 20;

		setTimeout(() => {
			instance_destroy(this);
		}, 3000);
	}

	draw() {
		this.time++;
		this.time = Math.min(this.max_time, this.time);
		if (this.time === this.max_time) {
			this.target_y += 3;
		}
		this.x += ((this.target_x + this.start_x) - this.x) / 25;
		this.y += ((this.target_y + this.start_y) - this.y) / 20;

		this.alpha -= 0.05;

		drawSetColor(color.white);
		drawSetAlpha(Math.min(Math.max(0, this.alpha), 1));
		drawCircle(
			this.x,
			this.y,
			this.size,
			true
		);

		drawSetAlpha(1);
		drawSetColor(color.black);
	}
}


class Introduce extends ArtistElement {
	create() {
		this.time = 0;
		this.max_time = 50;
		this.angle = 0;
	}

	draw() {
		this.time++;
		this.time = Math.min(this.max_time, this.time);
		this.angle = ease_in_out_expo(this.time / this.max_time) * 180 + 180;

		drawSetFont(50, 'Arial');
		drawSetColor(color.white);
		drawTextTransformed(
			window.variables.DISPLAY_WIDTH / 2,
			window.variables.DISPLAY_HEIGHT - 200 * ease_in_out_expo(this.time / this.max_time) + 50,
			'Firework!',
			'center',
			this.angle);
		drawSetColor(color.black);
	}
}

class Wallpaper extends ArtistElement {
	create() {
		this.alpha = 0;
		this.time = 0;
		this.max_time = 50;
	}

	draw() {
		this.time++;
		this.time = Math.min(this.max_time, this.time);
		this.alpha = 0.8 * ease_in_out_expo(this.time / this.max_time);

		drawSetAlpha(this.alpha);
		drawSetColor(color.black);
		drawRectangle(
			0,
			0,
			window.variables.DISPLAY_WIDTH,
			window.variables.DISPLAY_HEIGHT,
			true);
		drawSetAlpha(1);
	}
}

// 마우스 좌표를 알기 위한 목적으로 만든 클래스
class MousePointer extends ArtistElement {
	draw() {
		if (window.variables.MOUSE_CLICK === true) {
			drawSetAlpha(0.6);
			drawSetColor(color.white);
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