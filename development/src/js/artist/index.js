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
    if (window.variables.debug == true) {
        const welcomeCss =
            'text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;';

        console.log('%cWelcome %s', welcomeCss, 'Artist Drawing Started!');
    }

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
        console.log(`%c [Room Start] : ${window.variables.room_index}`, 'background: #222; color: #bada55');
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
//#endregion

//#region ETC
export function lengthdir_x(dist, angle) {
    return dist * Math.cos(angle);
}

export function lengthdir_y(dist, angle) {
    return dist * -Math.sin(angle);
}
//#endregion
