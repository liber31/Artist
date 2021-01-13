import { set_canvas, set_DEBUG_MODE, start, ArtistElement, instance_create, instance_destroy } from './artist.js';
import { drawRectangle, drawTextTransformed, drawSetFont, spriteLoad, drawSprite, drawLine, drawText, drawCircle, drawSetAlpha, drawSetColor, color, drawSpriteExt } from './draw.js';
import { set_FULLSCREEN } from './device.js';
import { point_direction, lengthdir_x, lengthdir_y, random_range, irandom_range, ease_in_out_expo } from './math.js';

const canvas = document.getElementById('canvas');

const text_array = ['안녕하세요', 'Hello', 'こんにちは', '你好', 'Xin chào', 'Ciao', 'Guten Tag', 'Hola', 'Hej', 'salve', 'Apa kabar', 'merhaba', 'Habari za kucha', 'Сайн байна уу', 'Здравствуйте', 'mirëmëngjes', 'Bonjour'];
try {
	set_canvas(canvas);
	set_FULLSCREEN(true);
	set_DEBUG_MODE(true);

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

} catch (err) {
	alert(err);
}

class Texts extends ArtistElement {
	create() {
		this.size = irandom_range(1, 5);
		this.text = '안녕하세요';
		this.position_x = 1300;
		this.position_y = irandom_range(0, 1000);
		this.alpha = 0;
		this.target_alpha = random_range(0.2, 0.8);
	}

	update() {
		this.x = (window.variables.DISPLAY_WIDTH / 1000) * this.position_x;
		this.y = (window.variables.DISPLAY_HEIGHT / 1000) * this.position_y;
		this.alpha += (this.target_alpha - this.alpha) / 30;
		this.position_x -= this.alpha * 5;

		if (this.x < -window.variables.DISPLAY_WIDTH) {
			instance_destroy(this);
		}
	}

	draw() {
		drawSetAlpha(this.alpha);
		drawSetColor(color.black);
		drawSetFont(
			100 * window.variables.DISPLAY_RATIO * this.size,
			'Arial');
		drawTextTransformed(
			this.x,
			this.y,
			this.text,
			'center',
			0
		);
		drawSetAlpha(1);
	}
}

// 마우스 좌표를 알기 위한 목적으로 만든 클래스
class MousePointer extends ArtistElement {
	draw() {
		if (window.variables.MOUSE_CLICK === true) {
			drawSetAlpha(0.6);
			drawSetColor(color.black);
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