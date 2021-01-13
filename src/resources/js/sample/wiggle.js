import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color } from './draw.js';
import { set_FULLSCREEN } from './device.js';

try {
	const canvas = document.getElementById('canvas');

	set_canvas(canvas);
	set_FULLSCREEN(true);
	set_DEBUG_MODE(false);

	start();


	// Classes
	class Title extends ArtistElement {
		create() {
			this.text = 'Wiggle Text';
			this.x = window.variables.DISPLAY_WIDTH / 2;
			this.y = window.variables.DISPLAY_HEIGHT / 1.5;
			this.target_y = window.variables.DISPLAY_HEIGHT / 3;
			this.alpha = 0;
			this.angle = -150;
			this.font_size = 50;
			this.add_x = 0;
			this.add_y = 0;
			this.add_angle = 0;
		}

		update() {
			this.y += (this.target_y - this.y) / 12;
			this.alpha += (1 - this.alpha) / 40;
			this.angle += (0 - this.angle) / 20;
			this.add_x += 0.05;
			this.add_y += 0.1;
			this.add_angle += 0.05;
		}

		draw() {
			let dist = point_distance(this.x, this.y, window.variables.MOUSE_X, window.variables.MOUSE_Y);
			let angle = point_angle(window.variables.DISPLAY_WIDTH / 2, window.variables.DISPLAY_HEIGHT / 2, window.variables.MOUSE_X, window.variables.MOUSE_Y);

			drawSetFont(this.font_size, 'Arial');
			drawSetColor(color.black);
			drawSetAlpha(this.alpha);
			drawTextTransformed(this.x + lengthdir_x(20, this.add_x % 360) - lengthdir_x(dist / 40, angle), this.y + lengthdir_y(10, this.add_y % 360) - lengthdir_y(dist / 40, angle), this.text, 'center', this.angle + lengthdir_y(8, this.add_angle) - 4);
			drawSetAlpha(1);
			drawCircle(window.variables.DISPLAY_WIDTH / 2, window.variables.DISPLAY_HEIGHT / 2, 3, true);
			drawCircle(window.variables.MOUSE_X / 2, window.variables.MOUSE_Y / 2, 3, true);
		}
	}

	setTimeout(() => {
		let title = instance_create(Title, 0, 0, 1);
	}, 1000);

	setTimeout(() => {
		let title = instance_create(Title, 0, 0, 1);
		title.target_y += 100;
		title.font_size = 20;
		title.text = '안녕하세요, 반갑습니다.';
		title.angle = 150;
	}, 1150);


	setTimeout(() => {
		let title = instance_create(Title, 0, 0, 1);
		title.target_y += 200;
		title.font_size = 20;
		title.text = 'Artist Library를 이용해 만든 Wiggle Text 입니다.';
	}, 1300);

} catch (err) {
	alert(err);
}

// ETC
function lengthdir_x(dist, angle) {
	return dist * Math.cos(angle);
}

function lengthdir_y(dist, angle) {
	return dist * -Math.sin(angle);
}

function point_distance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function point_angle(x1, y1, x2, y2) {
	let rad = Math.atan2(y2 - y1, x2 - x1);
	return (rad * 180) / Math.PI;
}