//#CodeStart
/** Get Mouse Position */
function getMousePos(canvas, evt) {
    if (canvas !== null) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    }
}

/** 마우스의 위치를 업데이트 해줍니다 */
function onMouseUpdate(evt) {
    let pos = getMousePos(window.variables.canvas, evt);
    window.variables.display_mouse_x = pos.x;
    window.variables.display_mouse_y = pos.y;
}

export function mobile_io_start() {
  window.variables.canvas.addEventListener('touchstart', (e) => {
    let touch = e.touches[0];
    window.variables.display_mouse_x = touch.clientX;
    window.variables.display_mouse_y = touch.clientY;
    window.variables.mouse_pressed = true;
    window.variables.mouse_click = true;
  });
  window.variables.canvas.addEventListener('touchend', () => {
    window.variables.mouse_click = false;
  });
  window.variables.canvas.addEventListener('touchmove', (e) => {
    let touch = e.touches[0];
    window.variables.display_mouse_x = touch.clientX;
    window.variables.display_mouse_y = touch.clientY;
  });
}

export function pc_io_start() {
  window.addEventListener('mousemove', onMouseUpdate, false);
  window.addEventListener('mouseenter', onMouseUpdate, false);
  window.onmousedown = function (_evt) {
      if (window.variables.mouse_x >= 0 && window.variables.mouse_y >= 0 && window.variables.mouse_x <= window.variables.width && window.variables.mouse_y <= window.variables.height) {
          window.variables.mouse_pressed = true;
          window.variables.mouse_click = true;
      }
  };
  window.onmouseup = function (_evt) {
      if (window.variables.mouse_x >= 0 && window.variables.mouse_y >= 0 && window.variables.mouse_x <= window.variables.width && window.variables.mouse_y <= window.variables.height) {
          window.variables.mouse_click = false;
      }
  };
  window.onkeydown = function (evt) {
      window.variables.keyboard_check = true;
      window.variables.keyboard_code = evt.which || evt.keyCode;
  };
  window.onkeyup = function (_evt) {
      window.variables.keyboard_check = false;
      window.variables.keyboard_code - 1;
  };
}