/* -------------------------------------------------------------------------- */
/*                           Define global variables                          */
/* -------------------------------------------------------------------------- */
window.variables = {
    debug: true,

    /** 현재 게임의 fps입니다 */
    fps: 0,
    times: [],

    canvas: undefined,
    /** 게임의 가로 사이즈입니다 */
    width: 0,
    /** 게임의 세로 사이즈입니다 */
    height: 0,

    step: {},
    draw: {},
    prepare: {},
    instances: {},
    sprite: {},
    keyboard_check: false,
    keyboard_code: -1,

    room: {},
    /** 현재 실행중인 룸의 인덱스입니다 */
    room_index: 0,

    /** 마우스가 눌러진 첫 순간에 true, 이외는 false를 반환합니다 */
    mouse_pressed: false,
    /** 마우스가 눌러져 있으면 true, 이외는 false를 반환합니다 */
    mouse_click: false,
    /** 마우스의 x 좌표입니다 */
    mouse_x: 0,
    /** 마우스의 y 좌표입니다 */
    mouse_y: 0,
    real_mouse_x: 0,
    real_mouse_y: 0,

    draw_color: 'black',
    draw_alpha: 1,
    draw_font: 'Arial',
    draw_font_size: 15,

    /** 따라갈 인스턴스입니다 */
    view_instance: undefined,
    view_padding_x: 0,
    view_padding_y: 0,
    view_x: 0,
    view_y: 0,
};
