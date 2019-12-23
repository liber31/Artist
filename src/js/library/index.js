/* -------------------------------------------------------------------------- */
/*                 게임에서 전반적으로 사용되는 변수과 상수들을 선언합니다                  */
/* -------------------------------------------------------------------------- */
const times = [];
let step = {};
let draw = {};
let instances = {};
let fps = 0;
let mouse_x = 0;
let mouse_y = 0;
let mouse_pressed = false;
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

        for (let index in step) {
          let _item = step[index];
          _item.step(canvas);
        }

        for (let index in draw) {
          let _item = draw[index];
          _item.draw(canvas);
        }

        /* ------------------------------ 계산된 FPS를 그립니다 ----------------------------- */
        const fpsCounter = canvas.getContext('2d');
        fpsCounter.font = '15px Arial';
        fpsCounter.textAlign = 'left';
        fpsCounter.fillText(fps, 5, 15);

        /* --------------------------- 특정 변수들을 원래대로 돌려놓습니다 -------------------------- */
        mouse_pressed = false;
      });
    });
  }

  while (true) {
    await loop();
  }
}

/* -------------------------------------------------------------------------- */
/*                               입출력장치를 후킹합니다                            */
/* -------------------------------------------------------------------------- */
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

document.onmousedown = function() {
  mouse_pressed = true;
  mouse_click = true;
};

document.onmouseup = function() {
  mouse_click = false;
};

function onMouseUpdate(e) {
  mouse_x = e.pageX - 5;
  mouse_y = e.pageY - 5;
}

refreshLoop();
