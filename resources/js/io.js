//#CodeStart

/** @description I/O 처리 이벤트에 핸들러를 등록해줍니다 */
export function IOWatchStart() {
  // Moblie
  window.variables.canvas.addEventListener('touchstart', onTouchStart);
  window.variables.canvas.addEventListener('touchend', onTouchEnd);
  window.variables.canvas.addEventListener('touchmove', onTouchMove);

  // PC
  window.addEventListener('mousemove', onMouseUpdate);
  window.addEventListener('mouseenter', onMouseUpdate);
  window.onmousedown = onMouseDown;
  window.onmouseup = onMouseUp;
  
  // Common
  window.onkeydown = onKeyboardDown;
  window.onkeyup = onKeyboardUp;
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
  const pos = getMousePosition(window.variables.canvas, evt);
  window.variables.display_mouse_x = pos.x;
  window.variables.display_mouse_y = pos.y;
}

function onMouseDown(_evt) {
  if (window.variables.mouse_x >= 0 && window.variables.mouse_y >= 0 && window.variables.mouse_x <= window.variables.display_width && window.variables.mouse_y <= window.variables.display_height) {
    window.variables.mouse_pressed = true;
    window.variables.mouse_click = true;
  }
}

function onMouseUp(_evt) {
  if (window.variables.mouse_x >= 0 && window.variables.mouse_y >= 0 && window.variables.mouse_x <= window.variables.display_width && window.variables.mouse_y <= window.variables.display_height) {
    window.variables.mouse_click = false;
  }
}

function onKeyboardDown(evt) {
  window.variables.keyboard_check = true;
  window.variables.keyboard_code = evt.which || evt.keyCode;
}

function onKeyboardUp(_evt) {
  window.variables.keyboard_check = false;
  window.variables.keyboard_code - 1;
}

function onTouchStart(evt) {
  const touch = evt.touches[0];
  window.variables.display_mouse_x = touch.clientX;
  window.variables.display_mouse_y = touch.clientY;
  window.variables.mouse_pressed = true;
  window.variables.mouse_click = true;
}

function onTouchEnd() {
  window.variables.mouse_click = false;
}

function onTouchMove(evt) {
  const touch = evt.touches[0];
  window.variables.display_mouse_x = touch.clientX;
  window.variables.display_mouse_y = touch.clientY;
}