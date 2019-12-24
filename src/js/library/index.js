/* -------------------------------------------------------------------------- */
/*                 게임에서 전반적으로 사용되는 변수과 상수들을 선언합니다                  */
/* -------------------------------------------------------------------------- */
const times = [];
let step = {};
let draw = {};
let prepare = {};
let instances = {};
let room = {};
let room_index = undefined;
let sprite = {};
let fps = 0;
let keyboard_check = false;
let keyboard_code = -1;
let draw_color = 'black';
let draw_alpha = 1;
let draw_font = 'Arial';
let draw_font_size = 15;

/** 마우스의 x 좌표입니다 */
let mouse_x = 0;
/** 마우스의 y 좌표입니다 */
let mouse_y = 0;
/** 마우스가 눌러진 첫 순간에 true, 이외는 false를 반환합니다 */
let mouse_pressed = false;
/** 마우스가 눌러져 있으면 true, 이외는 false를 반환합니다 */
let mouse_click = false;

/* -------------------------------------------------------------------------- */
/*                          화면을 갱신하는 함수를 선언합니다                         */
/* -------------------------------------------------------------------------- */
/** 게임의 화면을 갱신하는 함수입니다 */
async function refreshLoop() {
  async function loop() {
    return new Promise(function(resolve, reject) {
      window.requestAnimationFrame(function() {
        /* ------------------------------- FPS를 계산합니다 ------------------------------- */
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
          times.shift();
        }
        times.push(now);
        fps = times.length;

        /* ------------------------------- 그릴 준비를 합니다 ------------------------------- */
        const canvas = document.getElementById('canvas');
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        if (!!canvas.getContext) {
          resolve();
        }

        for (let depth in instances) {
          let instances_by_depth = instances[depth];
          for (let object_name in instances_by_depth) {
            for (let index in instances_by_depth[object_name]) {
              let _item = instances_by_depth[object_name][index];
              _item.prepare(canvas);
            }
          }
        }

        for (let depth in instances) {
          let instances_by_depth = instances[depth];
          for (let object_name in instances_by_depth) {
            for (let index in instances_by_depth[object_name]) {
              let _item = instances_by_depth[object_name][index];
              _item.step(canvas);
            }
          }
        }
        for (let depth in instances) {
          let instances_by_depth = instances[depth];
          for (let object_name in instances_by_depth) {
            for (let index in instances_by_depth[object_name]) {
              let _item = instances_by_depth[object_name][index];
              _item.draw(canvas);
            }
          }
        }

        /* ------------------------------ 계산된 FPS를 그립니다 ----------------------------- */
        if (DEBUG) {
          const ctx = canvas.getContext('2d');
          ctx.font = '15px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(Math.min(60, fps), 5, 15);
        }

        /* --------------------------- 특정 변수들을 원래대로 돌려놓습니다 -------------------------- */
        mouse_pressed = false;
      });
    });
  }

  while (true) {
    await loop();
  }
}

/** ctx를 받고, 현재 캔버스의 설정을 입력합니다 */
function setDrawMode(ctx) {
  ctx.restore();
  ctx.scale(1, 1);
  ctx.font = `${draw_font_size}px ${draw_font}`;
  ctx.lineWidth = 1;
  ctx.globalAlpha = draw_alpha;
  ctx.fillStyle = draw_color;
}

/* -------------------------------------------------------------------------- */
/*                               입출력장치를 후킹합니다                            */
/* -------------------------------------------------------------------------- */
window.addEventListener('mousemove', onMouseUpdate, false);
window.addEventListener('mouseenter', onMouseUpdate, false);
function onMouseUpdate(e) {
  mouse_x = e.pageX - 5;
  mouse_y = e.pageY - 5;
}
window.onmousedown = function() {
  mouse_pressed = true;
  mouse_click = true;
};
window.onmouseup = function() {
  mouse_click = false;
};
window.onkeydown = function(e) {
  keyboard_check = true;
  keyboard_code = e.which || e.keyCode;
};
window.onkeyup = function(e) {
  keyboard_check = false;
  keyboard_code - 1;
};

/* -------------------------------------------------------------------------- */
/*                                   룸 기능                                    */
/* -------------------------------------------------------------------------- */
/** 해당 룸으로 이동합니다 */
function room_goto(index) {
  room_index = index;
  for (let depth in instances) {
    let instances_by_depth = instances[depth];
    for (let object_name in instances_by_depth) {
      for (let index in instances_by_depth[object_name]) {
        let _item = instances_by_depth[object_name][index];
        _item.destroy();
      }
    }
  }
  console.log('[Room moved]', room_index);
  room[room_index]();
}

refreshLoop();
