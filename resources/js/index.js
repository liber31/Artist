import { setCanvas, setFps, setTargetSize, start } from "../artist/00_Routine/routine.js";
import { ArtistElement, instanceDestroy } from "../artist/01_Object/element.js";
import { setDebugMode } from "../artist/05_Debug/debug.js";
import { setFullScreen } from "../artist/98_Platform/base.js";
import { instanceCreate } from "../artist/01_Object/element.js";
import { drawSetAlpha, drawSetColor } from "../artist/02_Draw/base.js";
import { irandomRange, randomRange } from "../artist/04_Math/random.js";
import { drawSetFont, drawTextTransformed } from "../artist/02_Draw/text.js";

setCanvas(document.getElementById('canvas'));
setTargetSize(480, 800);
setFullScreen(true);
setDebugMode(true);
setFps(60);

const global = window.variables;

const text_array = ['안녕하세요', 'Hello', 'こんにちは', '你好', 'Xin chào', 'Ciao', 'Guten Tag', 'Hola', 'Hej', 'salve', 'Apa kabar', 'merhaba', 'Habari za kucha', 'Сайн байна уу', 'Здравствуйте', 'mirëmëngjes', 'Bonjour'];
try {
    setTimeout(() => {
        let index = 0;
        setInterval(() => {
            const text = instanceCreate(Text, 0, 0, 2);
            text.text = text_array[index];
            index++;
            index %= text_array.length;
        }, 1000);
    }, 0);

    setTimeout(() => {
        setTargetSize(720, 1280);
    }, 5000);

} catch (err) {
    alert(err);
}

class Text extends ArtistElement {
    create() {
        this.size = irandomRange(1, 5);
        this.text = '안녕하세요';
        this.position_x = 1300;
        this.position_y = irandomRange(0, 1000);
        this.alpha = 0;
        this.target_alpha = randomRange(0.2, 0.8);
    }

    update() {
        this.x = (global.WIDTH / 1000) * this.position_x;
        this.y = (global.HEIGHT / 1000) * this.position_y;
        this.alpha += (this.target_alpha - this.alpha) / 30;
        this.position_x -= this.alpha * 5;

        if (this.x < global.WIDTH / 2) {
            instanceDestroy(this);
        }
    }

    draw() {
        drawSetAlpha(this.alpha);
        drawSetColor('black');
        drawSetFont(
            30 * this.size,
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

class Test extends ArtistElement {
    create() {
        setTimeout(() => {
            instanceDestroy(this);
        }, 3000);
    }
    draw() {
        drawSetAlpha(this.alpha);
        drawSetColor('black');
        drawSetFont(
            30,
            'Arial');
        drawTextTransformed(
            global.WIDTH / 2,
            global.HEIGHT / 2,
            'TEST MESSAGE',
            'center',
            0
        )
        drawSetAlpha(1);
    }
}

instanceCreate(Test, 0, 0, 2)

start();