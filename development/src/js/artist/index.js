import { uuid } from './assets/uuid.js';

//#region Instance Feature
/** 게임에서 사용되는 인스턴스의 뼈대입니다 */
export class instance {
    /** 인스턴스의 초기 설정을 진행합니다 */
    init(depth) {
        this.alive = true;
        this.id = uuid();
        if (window.variables.debug == true) console.log('[Created instance]', `${this.constructor.name} (${this.id})`);

        if (!window.variables.instances[depth]) {
            window.variables.instances[depth] = {};
        }

        if (!window.variables.instances[depth][this.constructor.name]) {
            window.variables.instances[depth][this.constructor.name] = [];
        }
        window.variables.instances[depth][this.constructor.name][this.id] = this;

        this.x = 0;
        this.y = 0;
        this.xscale = 1;
        this.yscale = 1;
        this.collider_width = 0;
        this.collider_height = 0;
        this.depth = depth;
    }

    /** 객체의 생사 여부를 결정 짓는 함수입니다 */
    destroy() {
        if (this.alive) {
            if (window.variables.debug == true) console.log('[Deleted instance]', `${this.constructor.name} (${this.id})`);

            this.alive = false;
            delete this.x;
            delete this.y;
            delete this.id;
            delete this.collider_width;
            delete this.collider_height;
            delete window.variables.instances[this.depth][this.constructor.name][this.id];
        }
    }

    /** 인스턴스의 초기 검사를 진행합니다 */
    prepare() {
        if (this.collider_width !== 0 && this.collider_height !== 0) {
            if (
                window.variables.mouse_x >= this.x - this.collider_width / 2 &&
                window.variables.mouse_x <= this.x + this.collider_width / 2 &&
                window.variables.mouse_y >= this.y - this.collider_height / 2 &&
                window.variables.mouse_y <= this.y + this.collider_height / 2
            ) {
                if (window.variables.mouse_pressed && this.pressed !== undefined) {
                    this.pressed();
                }
                if (window.variables.mouse_click && this.clicked !== undefined) {
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
export function instance_destroy(object_name) {
    for (let depth in window.variables.instances) {
        for (let object in window.variables.instances[depth][object_name]) {
            let _item = window.variables.instances[depth][object_name][object];
            _item.destroy();
            delete window.variables.instances[depth][object_name][object];
        }
    }
}

/** 해당 object를 x, y 좌표에 생성합니다. depth에 0을 절대로 쓰지마세요! depth가 크면 클수록 인스턴스가 위에 그려집니다 */
export function instance_create(object, x, y, depth) {
    let ins = new object();
    ins.init(depth);
    ins.x = x;
    ins.y = y;
    ins.create();
    return ins;
}

/** 마우스 클릭 범위를 설정합니다. ins에는 instance를 넣어주세요 */
export function set_collider(ins, width, height) {
    ins.collider_width = width;
    ins.collider_height = height;
}

/** 따라갈 인스턴스를 설정합니다 */
export function set_view_target_instance(instance) {
    view_instance = instance;
}
//#endregion

//#region Draw Features
/** 사각형을 그립니다 */
export function draw_rectangle(x1, y1, x2, y2, fill) {
    x1 += window.variables.view_padding_x;
    y1 += window.variables.view_padding_y;
    x2 += window.variables.view_padding_x;
    y2 += window.variables.view_padding_y;

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
export function draw_circle(x, y, r, fill) {
    x += window.variables.view_padding_x;
    y += window.variables.view_padding_y;
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
export function draw_text(x, y, text) {
    x += window.variables.view_padding_x;
    y += window.variables.view_padding_y;
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.textAlign = 'left';
    ctx.fillText(text, x, y + 15);
}

/** 글자를 해당 정렬 방식에 맞추어 그립니다. align: "left" or "right" or "center" */
export function draw_text_transformed(x, y, text, align, angle = 0) {
    x += window.variables.view_padding_x;
    y += window.variables.view_padding_y;
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.save();
    ctx.textAlign = align;
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-x, -y);
    ctx.fillText(text, x, y + window.variables.draw_font_size / 2);
    ctx.restore();
}

/** 선을 그립니다 */
export function draw_line(x1, y1, x2, y2) {
    x1 += window.variables.view_padding_x;
    y1 += window.variables.view_padding_y;
    x2 += window.variables.view_padding_x;
    y2 += window.variables.view_padding_y;
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/** 해당 두께의 선을 그립니다 */
export function draw_line_width(x1, y1, x2, y2, width) {
    x1 += window.variables.view_padding_x;
    y1 += window.variables.view_padding_y;
    x2 += window.variables.view_padding_x;
    y2 += window.variables.view_padding_y;
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width;
    ctx.stroke();
}

/** 이미지를 불러옵니다 */
export function sprite_load(dir, sprite_name) {
    let img = new Image();
    img.src = dir;

    window.variables.sprite[sprite_name] = img;
}

export function sprite_get_width(sprite_name) {
    return window.variables.sprite[sprite_name].width;
}
export function sprite_get_height(sprite_name) {
    return window.variables.sprite[sprite_name].height;
}

/** 불러온 이미지를 그립니다 */
export function draw_sprite(x, y, sprite_name) {
    x += window.variables.view_padding_x;
    y += window.variables.view_padding_y;
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    ctx.drawImage(window.variables.sprite[sprite_name], x, y, window.variables.sprite[sprite_name].width, window.variables.sprite[sprite_name].height);
}

/** 해당 이미지를 해당 정렬 방식과 사이즈에 맞추어 그립니다 */
export function draw_sprite_ext(x, y, sprite_name, align, xscale, yscale) {
    x += window.variables.view_padding_x;
    y += window.variables.view_padding_y;
    const ctx = canvas.getContext('2d');
    setDrawMode(ctx);
    if (align == 'center') {
        x += xscale < 0 ? (window.variables.sprite[sprite_name].width * xscale) / 2 : -(window.variables.sprite[sprite_name].width * xscale) / 2;
        y += yscale < 0 ? (window.variables.sprite[sprite_name].height * yscale) / 2 : -(window.variables.sprite[sprite_name].height * yscale) / 2;
    }
    ctx.translate(x - (xscale < 0 ? window.variables.sprite[sprite_name].width * xscale : 0), y - (yscale < 0 ? window.variables.sprite[sprite_name].height * yscale : 0));
    ctx.scale(xscale, yscale);
    ctx.drawImage(window.variables.sprite[sprite_name], 0, 0, window.variables.sprite[sprite_name].width, window.variables.sprite[sprite_name].height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
}

/** 드로우 모드의 투명도를 설정합니다 */
export function draw_set_alpha(alpha) {
    window.variables.draw_alpha = alpha;
}

/** 드로우 모드의 색을 설정합니다 */
export function draw_set_color(color) {
    window.variables.draw_color = color;
}

/** 드로우 모드의 폰트를 설정합니다 */
export function draw_set_font(size, font) {
    window.variables.draw_font_size = size;
    window.variables.draw_font = font;
}
//#endregion

//#region Engine
/** ctx를 받고, 현재 캔버스의 설정을 입력합니다 */
function setDrawMode(ctx) {
    ctx.restore();
    ctx.scale(1, 1);
    ctx.font = `${window.variables.draw_font_size}px ${window.variables.draw_font}`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = window.variables.draw_alpha;
    ctx.fillStyle = window.variables.draw_color;
    ctx.strokeStyle = window.variables.draw_color;
}

/** 게임 화면의 사이즈를 최대로 설정합니다 */
export function set_fullscreen() {
    const canvas = document.getElementById('canvas');
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    // 브라우저에서 canvas가 표시되는 크기 탐색
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // canvas가 같은 크기가 아닐 때 확인
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        // canvas를 동일한 크기로 수정
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

export async function drawingStart() {
    async function loop() {
        return new Promise(function (resolve, _reject) {
            window.requestAnimationFrame(function () {
                /* ------------------------------- FPS를 계산합니다 ------------------------------- */
                const now = performance.now();
                while (window.variables.times.length > 0 && window.variables.times[0] <= now - 1000) {
                    window.variables.times.shift();
                }
                window.variables.times.push(now);
                window.variables.fps = window.variables.times.length;

                /* ------------------------------- 그릴 준비를 합니다 ------------------------------- */
                window.variables.canvas = document.getElementById('canvas');
                window.variables.canvas.getContext('2d').clearRect(0, 0, window.variables.canvas.width, window.variables.canvas.height);

                window.variables.width = window.variables.canvas.width;
                window.variables.height = window.variables.canvas.height;
                if (window.variables.view_instance !== undefined) {
                    window.variables.view_padding_x = -window.variables.view_instance.x + window.variables.width / 2;
                    window.variables.view_padding_y = -window.variables.view_instance.y + window.variables.height / 2;
                    window.variables.view_x = window.variables.view_instance.x - window.variables.width / 2;
                    window.variables.view_y = window.variables.view_instance.y - window.variables.height / 2;

                    window.variables.mouse_x = window.variables.real_mouse_x + window.variables.view_instance.x - window.variables.width / 2;
                    window.variables.mouse_y = window.variables.real_mouse_y + window.variables.view_instance.y - window.variables.height / 2;
                } else {
                    window.variables.view_padding_x = 0;
                    window.variables.view_padding_y = 0;
                    window.variables.view_x = 0;
                    window.variables.view_y = 0;

                    window.variables.mouse_x = window.variables.real_mouse_x;
                    window.variables.mouse_y = window.variables.real_mouse_y;
                }

                if (!!window.variables.canvas.getContext) {
                    resolve();
                }

                for (let depth in window.variables.instances) {
                    let instances_by_depth = window.variables.instances[depth];
                    for (let object_name in instances_by_depth) {
                        for (let index in instances_by_depth[object_name]) {
                            let _item = instances_by_depth[object_name][index];
                            if (_item.prepare !== undefined && _item.alive === true) {
                                _item.prepare(window.variables.canvas);
                            }
                        }
                    }
                }
                for (let depth in window.variables.instances) {
                    let instances_by_depth = window.variables.instances[depth];
                    for (let object_name in instances_by_depth) {
                        for (let index in instances_by_depth[object_name]) {
                            let _item = instances_by_depth[object_name][index];
                            if (_item.step !== undefined && _item.alive === true) {
                                _item.step(window.variables.canvas);
                            }
                        }
                    }
                }
                for (let depth in window.variables.instances) {
                    let instances_by_depth = window.variables.instances[depth];
                    for (let object_name in instances_by_depth) {
                        for (let index in instances_by_depth[object_name]) {
                            let _item = instances_by_depth[object_name][index];
                            if (_item.draw !== undefined && _item.alive === true) {
                                _item.draw(window.variables.canvas);
                            }
                        }
                    }
                }

                /* ------------------------------ 계산된 FPS를 그립니다 ----------------------------- */
                if (window.variables.debug == true) {
                    const ctx = canvas.getContext('2d');
                    ctx.font = '15px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillStyle = 'green';
                    ctx.globalAlpha = 1;
                    ctx.fillText(Math.min(60, window.variables.fps), 5, 15);
                }

                /* --------------------------- 특정 변수들을 원래대로 돌려놓습니다 -------------------------- */
                window.variables.mouse_pressed = false;
            });
        });
    }

    while (true) {
        await loop();
    }
}

/** 해당 룸으로 이동합니다 */
export function room_goto(index) {
    window.variables.room_index = index;
    window.variables.view_instance = undefined;
    for (let depth in window.variables.instances) {
        let instances_by_depth = window.variables.instances[depth];
        for (let object_name in instances_by_depth) {
            for (let index in instances_by_depth[object_name]) {
                let _item = instances_by_depth[object_name][index];
                _item.destroy();
                delete window.variables.instances[depth][object_name][index];
            }
        }
    }
    if (window.variables.debug == true) {
        console.log('[Room moved]', window.variables.room_index);
    }
    window.variables.canvas = document.getElementById('canvas');
    function start() {
        if (window.variables.canvas === null) {
            setTimeout(() => {
                start();
            }, 10);
            return;
        }
        window.variables.canvas.addEventListener('touchstart', function (e) {
            let touch = e.touches[0];
            (window.variables.real_mouse_x = touch.clientX), (window.variables.real_mouse_y = touch.clientY);
            window.variables.mouse_pressed = true;
            window.variables.mouse_click = true;
        });
        window.variables.canvas.addEventListener('touchend', function () {
            window.variables.mouse_click = false;
        });
        window.variables.canvas.addEventListener('touchmove', function (e) {
            let touch = e.touches[0];
            (window.variables.real_mouse_x = touch.clientX), (window.variables.real_mouse_y = touch.clientY);
        });
        window.variables.room[window.variables.room_index]();
    }
    setTimeout(() => {
        start();
    }, 10);
}
//#endregion

//#region IO
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
    window.variables.real_mouse_x = pos.x;
    window.variables.real_mouse_y = pos.y;
}

window.addEventListener('mousemove', onMouseUpdate, false);
window.addEventListener('mouseenter', onMouseUpdate, false);
window.onmousedown = function (_evt) {
    if (window.variables.mouse_x <= window.variables.width && window.variables.mouse_y <= window.variables.height) {
        window.variables.mouse_pressed = true;
        window.variables.mouse_click = true;
    }
};
window.onmouseup = function (_evt) {
    if (window.variables.mouse_x <= window.variables.width && window.variables.mouse_y <= window.variables.height) {
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
//#endregion

//#region ETC
export function lengthdir_x(dist, angle) {
    return dist * Math.cos(angle);
}

export function lengthdir_y(dist, angle) {
    return dist * -Math.sin(angle);
}
//#endregion
