/** 게임에서 사용되는 인스턴스의 뼈대입니다 */
class instance {
  /** 인스턴스의 초기 설정을 진행합니다 */
  init(depth) {
    this.alive = true;
    this.id = uuid();
    console.log('[Created instance]', `${this.constructor.name} (${this.id})`);

    if (!instances[depth]) {
      instances[depth] = {};
    }

    if (!instances[depth][this.constructor.name]) {
      instances[depth][this.constructor.name] = [];
    }
    instances[depth][this.constructor.name].push(this);

    this.x = 0;
    this.y = 0;
    this.collider_width = 0;
    this.collider_height = 0;
  }

  /** 객체의 생사 여부를 결정 짓는 함수입니다 */
  destroy() {
    if (this.alive) {
      console.log('[Deleted instance]', `${this.constructor.name} (${this.id})`);
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
  return ins;
}

/** 마우스 클릭 범위를 설정합니다 */
function set_collider(ins, width, height) {
  ins.collider_width = width;
  ins.collider_height = height;
}
