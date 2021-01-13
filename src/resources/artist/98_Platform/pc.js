
//#CodeStart


/** @description I/O 처리 이벤트에 핸들러를 등록해줍니다 */
export function pcIOWatch() {
    window.addEventListener('mousemove', onMouseUpdate);
    window.addEventListener('mouseenter', onMouseUpdate);
    window.onmousedown = onMouseDown;
    window.onmouseup = onMouseUp;
}


/** @description 마우스의 실제 좌표를 가져옵니다 */
function getMousePosition(canvas, evt) {
    if (!!canvas === false) {
        throw 'getMousePos - canvas is not exists';
    }
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    }
}

/** @description 마우스의 위치를 업데이트 해주는 이벤트 핸들러입니다 */
function onMouseUpdate(evt) {
    const pos = getMousePosition(window.variables.CANVAS, evt);
    window.variables.DISPLAY_MOUSE_X = pos.x;
    window.variables.DISPLAY_MOUSE_Y = pos.y;
}

function onMouseDown(_evt) {
    if (window.variables.MOUSE_X >= 0 && window.variables.MOUSE_Y >= 0 && window.variables.MOUSE_X <= window.variables.DISPLAY_WIDTH && window.variables.MOUSE_Y <= window.variables.DISPLAY_HEIGHT) {
        window.variables.MOUSE_PRESSED = true;
        window.variables.MOUSE_CLICK = true;
    }
}

function onMouseUp(_evt) {
    if (window.variables.MOUSE_X >= 0 && window.variables.MOUSE_Y >= 0 && window.variables.MOUSE_X <= window.variables.DISPLAY_WIDTH && window.variables.MOUSE_Y <= window.variables.DISPLAY_HEIGHT) {
        window.variables.MOUSE_CLICK = false;
    }
}