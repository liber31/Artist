//#CodeStart

export function setFullScreen(triggerBool) {
    window.variables.CANVAS.style['touch-action'] = 'none';
    window.variables.CANVAS.style.cursor = 'inherit';

    if (triggerBool === false) {
        window.variables.CANVAS.width = window.variables.WIDTH;
        window.variables.CANVAS.height = window.variables.HEIGHT;
        window.variables.CANVAS.style.width = `${window.variables.CANVAS.width}px`;
        window.variables.CANVAS.style.height = `${window.variables.CANVAS.height}px`;
        return;
    }

    window.variables.CANVAS.style.width = '100%';
    window.variables.CANVAS.style.height = '100%';
    window.variables.CANVAS.style['touch-action'] = 'none';
    window.variables.CANVAS.style.cursor = 'inherit';
    window.variables.FULLSCREEN = true;
    window.variables.CANVAS.width = window.innerWidth * 2;
    window.variables.CANVAS.height = window.innerHeight * 2;
    window.variables.DISPLAY_WIDTH = window.variables.CANVAS.width;
    window.variables.DISPLAY_HEIGHT = window.variables.CANVAS.height;
}

/** @description I/O 처리 이벤트에 핸들러를 등록해줍니다 */
export function commonIOWatch() {
    window.onkeydown = onKeyboardDown;
    window.onkeyup = onKeyboardUp;
}

function onKeyboardDown(evt) {
    window.variables.KEYBOARD_CHECK = true;
    window.variables.KEYBOARD_CODE = evt.which || evt.keyCode;
}

function onKeyboardUp(_evt) {
    window.variables.KEYBOARD_CHECK = false;
    window.variables.KEYBOARD_CODE - 1;
}