
//#CodeStart

export function mobileIOWatch() {
    window.variables.CANVAS.addEventListener('touchstart', onTouchStart);
    window.variables.CANVAS.addEventListener('touchend', onTouchEnd);
    window.variables.CANVAS.addEventListener('touchmove', onTouchMove);
}

function onTouchStart(evt) {
    const touch = evt.touches[0];
    window.variables.DISPLAY_MOUSE_X = touch.clientX;
    window.variables.DISPLAY_MOUSE_Y = touch.clientY;
    window.variables.MOUSE_PRESSED = true;
    window.variables.MOUSE_CLICK = true;
}

function onTouchEnd() {
    window.variables.MOUSE_CLICK = false;
}

function onTouchMove(evt) {
    const touch = evt.touches[0];
    window.variables.DISPLAY_MOUSE_X = touch.clientX;
    window.variables.DISPLAY_MOUSE_Y = touch.clientY;
}