import { setCanvas, setFps, setTargetSize, start } from "../artist/00_Routine/routine.js";
import { ArtistElement, instanceDestroy } from "../artist/01_Object/element.js";
import { setDebugMode } from "../artist/05_Debug/debug.js";
import { setFullScreen } from "../artist/98_Platform/base.js";
import { instanceCreate } from "../artist/01_Object/element.js";
import { drawSetAlpha, drawSetColor } from "../artist/02_Draw/base.js";
import { irandomRange, randomRange } from "../artist/04_Math/random.js";
import { drawSetFont, drawTextTransformed } from "../artist/02_Draw/text.js";
import { drawLine, drawTriangle, drawRectangle, Shape, drawCircle } from "../artist/02_Draw/shape.js";
import { easeInOutSine } from "../artist/04_Math/easing.js";
import { lengthdirY } from "../artist/04_Math/coordinate.js";

setCanvas(document.getElementById('canvas'));
setTargetSize(720, 1280);
setFullScreen(true);
setDebugMode(true);
setFps(60);

let score = 0;
let scoreSize = 100;
let lessScore = 10;
let square = null;
const global = window.variables;

class Square extends ArtistElement {
	create() {
		this.angle = 0;
		this.x = -100;
		this.y = global.HEIGHT / 2;
		this.hspeed = 0;
		this.moreJump = 2;
	}

	draw() {
		this.hspeed += 1;
		this.y += this.hspeed;
		if (this.y > global.HEIGHT / 2) {
			this.y = global.HEIGHT / 2;
			this.hspeed = 0;
			this.moreJump = 2;
		}
		this.x += (100 - this.x) / 8;
		drawSetAlpha(1);
		drawSetColor('black');
		drawRectangle(this.x - 25, this.y - 50, this.x + 25, this.y, true);
	}

	pressedGlobal() {
		if (this.hspeed === 0 || this.moreJump > 0) {
			this.hspeed = -15;
			this.moreJump--;
		}
	}
}

class Disturb extends ArtistElement {
	create() {
		this.x = global.WIDTH + 100;
		this.y = global.HEIGHT / 2;
		this.size = irandomRange(lessScore, Math.min(150, lessScore + 30));
	}

	draw() {
		this.x -= 5;
		drawSetAlpha(1);
		drawSetColor('black');
		drawRectangle(this.x - 25, this.y - this.size, this.x + 25, this.y, true);

		if (this.x <= -26) {
			score++;
			scoreSize = 500;
			if (score % 10 === 0) {
				lessScore += 30;
				if (lessScore > 150) {
					lessScore = 150;
				}
			}
			instanceDestroy(this);
		}

		if (square.y > this.y - this.size && this.x - 25 <= square.x + 25 && this.x + 25 >= square.x - 25) {
			instanceDestroy(this);
			score = 0;
			scoreSize = 50;
			lessScore = 10;
		}
	}
}

class Ground extends ArtistElement {
	create() {
		this.alpha = 0;
	}

	draw() {
		this.alpha += (0.7 - this.alpha) / 4;
		drawSetAlpha(this.alpha);
		drawSetColor('black');
		drawSetFont(scoreSize, 'Arial');
		drawTextTransformed(global.WIDTH / 2, global.HEIGHT / 2 - 200, score, 'center', 0);
		scoreSize += (200 - scoreSize) / 8;
		drawRectangle(0, global.HEIGHT / 2, global.WIDTH, global.HEIGHT, true);
	}
}

class Line extends ArtistElement {
	create() {
		this.time = 0;
		this.x = global.WIDTH + 100;
	}

	draw() {
		this.x -= 5;
		drawSetAlpha(1);
		drawSetColor('black');
		drawLine(this.x, 300, this.x, global.HEIGHT / 2);

		drawSetFont(30, 'Arial');
		drawTextTransformed(this.x, 270, this.time + 'm', 'center', 0);

		if (this.x <= -100) {
			instanceDestroy(this);
		}
	}
}

setTimeout(() => {
	square = instanceCreate(Square, 0, 0, 2);
}, 1000);


let meter = 100;
setTimeout(() => {
	instanceCreate(Ground, 0, 0, 3);

	const ins1 = instanceCreate(Line, 0, 0, 3);
	ins1.time = meter;
	setInterval(() => {
		const ins = instanceCreate(Line, 0, 0, 3);
		meter += 100;
		ins.time = meter;
	}, 4000);

	setInterval(() => {
		instanceCreate(Disturb, 0, 0, 3);
	}, 1000);
}, 1500);

start();