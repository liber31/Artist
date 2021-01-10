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

class Tester extends ArtistElement {
    create() {
        // new Audio('http://localhost:8080/sound/wiiShop.mp3').play();
    }
}

setTimeout(() => {

    instanceCreate(Tester, 0, 0, 2)
}, 1000);

start();