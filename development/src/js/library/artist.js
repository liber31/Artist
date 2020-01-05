/* -------------------------------------------------------------------------- */
/*                     게임에서 전반적으로 사용되는 값들을 선언합니다                     */
/* -------------------------------------------------------------------------- */
let DEBUG = false;
let c_black = 'black';
let c_green = 'green';
let c_red = 'red';
let c_white = 'white';
let c_gray = 'gray';
let c_yellow = 'yellow';

const times = [];
let step = {};
let draw = {};
let prepare = {};
let instances = {};
let room = {};
let sprite = {};
let keyboard_check = false;
let keyboard_code = -1;
let draw_color = 'black';
let draw_alpha = 1;
let draw_font = 'Arial';
let draw_font_size = 15;
let canvas;

/** 마우스의 x 좌표입니다 */
let mouse_x = 0;
/** 마우스의 y 좌표입니다 */
let mouse_y = 0;
let real_mouse_x = 0;
let real_mouse_y = 0;
/** 마우스가 눌러진 첫 순간에 true, 이외는 false를 반환합니다 */
let mouse_pressed = false;
/** 마우스가 눌러져 있으면 true, 이외는 false를 반환합니다 */
let mouse_click = false;
/** 현재 게임의 fps입니다 */
let fps = 0;
/** 현재 실행중인 룸의 인덱스입니다 */
let room_index = undefined;
/** 게임의 가로 사이즈입니다 */
let width = 0;
/** 게임의 세로 사이즈입니다 */
let height = 0;
/** 따라갈 인스턴스입니다 */
let view_instance = undefined;
let view_padding_x = 0;
let view_padding_y = 0;
let view_x = 0;
let view_y = 0;

/** 따라갈 인스턴스를 설정합니다 */
function set_view_target_instance(instance) {
  view_instance = instance;
}

/** uuid4 를 반환합니다 */
function uuid() {
  // UUID v4 generator in JavaScript (RFC4122 compliant)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 3) | 8;
    return v.toString(16);
  });
}

/** 해당 url로 post request를 보냅니다. */
async function request(url, object) {
  return new Promise((resolve, reject) => {
    let http = new XMLHttpRequest();
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        if (DEBUG) {
          console.log('[HTTP RECV]', http.responseText);
        }
        resolve(JSON.parse(http.responseText));
      }
    };
    if (DEBUG) {
      console.log('[HTTP SEND]', JSON.stringify(object));
    }
    http.send(JSON.stringify(object));
  });
}

/** 게임에서 사용되는 인스턴스의 뼈대입니다 */
class instance {
  /** 인스턴스의 초기 설정을 진행합니다 */
  init(depth) {
    this.alive = true;
    this.id = uuid();
    if (DEBUG) {
      console.log('[Created instance]', `${this.constructor.name} (${this.id})`);
    }

    if (!instances[depth]) {
      instances[depth] = {};
    }

    if (!instances[depth][this.constructor.name]) {
      instances[depth][this.constructor.name] = [];
    }
    instances[depth][this.constructor.name].push(this);

    this.x = 0;
    this.y = 0;
    this.xscale = 1;
    this.yscale = 1;
    this.collider_width = 0;
    this.collider_height = 0;
  }

  /** 객체의 생사 여부를 결정 짓는 함수입니다 */
  destroy() {
    if (this.alive) {
      if (DEBUG) {
        console.log('[Deleted instance]', `${this.constructor.name} (${this.id})`);
      }
      this.alive = false;
      delete this.x;
      delete this.y;
      delete this.id;
      delete this.collider_width;
      delete this.collider_height;
    }
  }

  /** 인스턴스의 초기 검사를 진행합니다 */
  prepare() {
    if (this.collider_width !== 0 && this.collider_height !== 0) {
      if (
        mouse_x >= this.x - this.collider_width / 2 &&
        mouse_x <= this.x + this.collider_width / 2 &&
        mouse_y >= this.y - this.collider_height / 2 &&
        mouse_y <= this.y + this.collider_height / 2
      ) {
        if (mouse_pressed && this.pressed !== undefined) {
          this.pressed();
        }
        if (mouse_click && this.clicked !== undefined) {
          this.clicked();
        }
      }
    }
  }

  /** 인스턴스가 생성되는 첫 순간에 동작합니다 */
  create() {}

  /** 스텝 이벤트때 동작합니다 */
  step() {}

  /** 드로우 이벤트때 동작합니다 */
  draw() {}
}

/** 해당 이름을 가진 객체를 세계에서 제거합니다 */
function instance_destroy(object_name) {
  for (let depth in instances) {
    for (let object in instances[depth][object_name]) {
      let _item = instances[depth][object_name][object];
      _item.destroy();
      delete instances[depth][object_name][object];
    }
  }
}

/** 해당 object를 x, y 좌표에 생성합니다. depth에 0을 절대로 쓰지마세요! depth가 크면 클수록 인스턴스가 위에 그려집니다 */
function instance_create(object, x, y, depth) {
  let ins = new object();
  ins.init(depth);
  ins.x = x;
  ins.y = y;
  ins.create();
  return ins;
}

/** 마우스 클릭 범위를 설정합니다 */
function set_collider(ins, width, height) {
  ins.collider_width = width;
  ins.collider_height = height;
}

/* -------------------------------------------------------------------------- */
/*                                    DRAW                                    */
/* -------------------------------------------------------------------------- */
/** 사각형을 그립니다 */
function draw_rectangle(x1, y1, x2, y2, fill) {
  x1 += view_padding_x;
  y1 += view_padding_y;
  x2 += view_padding_x;
  y2 += view_padding_y;

  if (!fill) {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
  } else {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  }
}

/** 동그라미를 그립니다 */
function draw_circle(x, y, r, fill) {
  x += view_padding_x;
  y += view_padding_y;
  if (!fill) {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  } else {
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

/** 글자를 그립니다 */
function draw_text(x, y, text) {
  x += view_padding_x;
  y += view_padding_y;
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.textAlign = 'left';
  ctx.fillText(text, x, y + 15);
}

/** 글자를 해당 정렬 방식에 맞추어 그립니다. align: "left" or "right" or "center" */
function draw_text_transformed(x, y, text, align, angle = 0) {
  x += view_padding_x;
  y += view_padding_y;
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.save();
  ctx.textAlign = align;
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.translate(-x, -y);
  ctx.fillText(text, x, y + draw_font_size / 2);
  ctx.restore();
}

/** 선을 그립니다 */
function draw_line(x1, y1, x2, y2) {
  x1 += view_padding_x;
  y1 += view_padding_y;
  x2 += view_padding_x;
  y2 += view_padding_y;
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/** 해당 두께의 선을 그립니다 */
function draw_line_width(x1, y1, x2, y2, width) {
  x1 += view_padding_x;
  y1 += view_padding_y;
  x2 += view_padding_x;
  y2 += view_padding_y;
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.stroke();
}

/** 이미지를 불러옵니다 */
function sprite_load(dir, sprite_name) {
  let img = new Image();
  img.src = dir;

  sprite[sprite_name] = img;
}

/** 불러온 이미지를 그립니다 */
function draw_sprite(x, y, sprite_name) {
  x += view_padding_x;
  y += view_padding_y;
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  ctx.drawImage(sprite[sprite_name], x, y, sprite[sprite_name].width, sprite[sprite_name].height);
}

/** 해당 이미지를 해당 정렬 방식과 사이즈에 맞추어 그립니다 */
function draw_sprite_ext(x, y, sprite_name, align, xscale, yscale) {
  x += view_padding_x;
  y += view_padding_y;
  const ctx = canvas.getContext('2d');
  setDrawMode(ctx);
  if (align == 'center') {
    x += xscale < 0 ? (sprite[sprite_name].width * xscale) / 2 : -(sprite[sprite_name].width * xscale) / 2;
    y += yscale < 0 ? (sprite[sprite_name].height * yscale) / 2 : -(sprite[sprite_name].height * yscale) / 2;
  }
  ctx.translate(x - (xscale < 0 ? sprite[sprite_name].width * xscale : 0), y - (yscale < 0 ? sprite[sprite_name].height * yscale : 0));
  ctx.scale(xscale, yscale);
  ctx.drawImage(sprite[sprite_name], 0, 0, sprite[sprite_name].width, sprite[sprite_name].height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.restore();
}

/** 드로우 모드의 투명도를 설정합니다 */
function draw_set_alpha(alpha) {
  draw_alpha = alpha;
}

/** 드로우 모드의 색을 설정합니다 */
function draw_set_color(color) {
  draw_color = color;
}

/** 드로우 모드의 폰트를 설정합니다 */
function draw_set_font(size, font) {
  draw_font_size = size;
  draw_font = font;
}

/* -------------------------------------------------------------------------- */
/*                          화면을 갱신하는 함수를 선언합니다                         */
/* -------------------------------------------------------------------------- */
/** 게임 화면의 사이즈를 최대로 설정합니다 */
function set_fullscreen() {
  let canvas = document.getElementById('canvas');
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  // 브라우저에서 canvas가 표시되는 크기 탐색
  let displayWidth = canvas.clientWidth;
  let displayHeight = canvas.clientHeight;

  // canvas가 같은 크기가 아닐 때 확인
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // canvas를 동일한 크기로 수정
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

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
        canvas = document.getElementById('canvas');
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        width = canvas.width;
        height = canvas.height;
        if (view_instance !== undefined) {
          view_padding_x = -view_instance.x + width / 2;
          view_padding_y = -view_instance.y + height / 2;
          view_x = view_instance.x - width / 2;
          view_y = view_instance.y - height / 2;

          mouse_x = real_mouse_x + view_instance.x - width / 2;
          mouse_y = real_mouse_y + view_instance.y - height / 2;
        } else {
          view_padding_x = 0;
          view_padding_y = 0;
          view_x = 0;
          view_y = 0;

          mouse_x = real_mouse_x;
          mouse_y = real_mouse_y;
        }

        if (!!canvas.getContext) {
          resolve();
        }

        for (let depth in instances) {
          let instances_by_depth = instances[depth];
          for (let object_name in instances_by_depth) {
            for (let index in instances_by_depth[object_name]) {
              let _item = instances_by_depth[object_name][index];
              if (_item.prepare !== undefined) {
                _item.prepare(canvas);
              }
            }
          }
        }
        for (let depth in instances) {
          let instances_by_depth = instances[depth];
          for (let object_name in instances_by_depth) {
            for (let index in instances_by_depth[object_name]) {
              let _item = instances_by_depth[object_name][index];
              if (_item.step !== undefined) {
                _item.step(canvas);
              }
            }
          }
        }
        for (let depth in instances) {
          let instances_by_depth = instances[depth];
          for (let object_name in instances_by_depth) {
            for (let index in instances_by_depth[object_name]) {
              let _item = instances_by_depth[object_name][index];
              if (_item.draw !== undefined) {
                _item.draw(canvas);
              }
            }
          }
        }

        /* ------------------------------ 계산된 FPS를 그립니다 ----------------------------- */
        if (DEBUG) {
          const ctx = canvas.getContext('2d');
          ctx.font = '15px Arial';
          ctx.textAlign = 'left';
          ctx.fillStyle = 'green';
          ctx.globalAlpha = 1;
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
  ctx.strokeStyle = draw_color;
}

/* -------------------------------------------------------------------------- */
/*                               입출력장치를 후킹합니다                            */
/* -------------------------------------------------------------------------- */
/** Get Mouse Position */
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
window.addEventListener('mousemove', onMouseUpdate, false);
window.addEventListener('mouseenter', onMouseUpdate, false);

/** 마우스의 위치를 업데이트 해줍니다 */
function onMouseUpdate(evt) {
  let pos = getMousePos(canvas, evt);
  real_mouse_x = pos.x;
  real_mouse_y = pos.y;
}
window.onmousedown = function(evt) {
  mouse_pressed = true;
  mouse_click = true;
};
window.onmouseup = function(evt) {
  mouse_click = false;
};
window.onkeydown = function(evt) {
  keyboard_check = true;
  keyboard_code = evt.which || evt.keyCode;
};
window.onkeyup = function(evt) {
  keyboard_check = false;
  keyboard_code - 1;
};

/* -------------------------------------------------------------------------- */
/*                                   룸 기능                                    */
/* -------------------------------------------------------------------------- */
/** 해당 룸으로 이동합니다 */
function room_goto(index) {
  room_index = index;
  view_instance = undefined;
  for (let depth in instances) {
    let instances_by_depth = instances[depth];
    for (let object_name in instances_by_depth) {
      for (let index in instances_by_depth[object_name]) {
        let _item = instances_by_depth[object_name][index];
        _item.destroy();
        delete instances[depth][object_name][index];
      }
    }
  }
  if (DEBUG) {
    console.log('[Room moved]', room_index);
  }
  canvas = document.getElementById('canvas');
  setTimeout(() => {
    canvas.addEventListener('touchstart', function(e) {
      let touch = e.touches[0];
      (real_mouse_x = touch.clientX), (real_mouse_y = touch.clientY);
      mouse_pressed = true;
      mouse_click = true;
    });
    canvas.addEventListener('touchend', function() {
      mouse_click = false;
    });
    canvas.addEventListener('touchmove', function(e) {
      let touch = e.touches[0];
      (real_mouse_x = touch.clientX), (real_mouse_y = touch.clientY);
    });
    room[room_index]();
  }, 100);
}

refreshLoop();
