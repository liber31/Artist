/** 게임에서 사용되는 인스턴스의 뼈대입니다 */
class instance {
  constructor() {
    this.alive = true;
    this.id = uuid();
    console.log(`Created instance - ${this.constructor.name} (${this.id})`);

    if (!instances[this.constructor.name]) {
      instances[this.constructor.name] = [];
    }
    instances[this.constructor.name].push(this);

    this.x = 0;
    this.y = 0;
    this.collider_width = 0;
    this.collider_height = 0;

    step[this.id] = this;
    draw[this.id] = this;
  }

  /** 객체의 생사 여부를 결정 짓는 함수입니다 */
  destroy() {
    if (this.alive) {
      console.log(`Deleted instance - ${this.constructor.name} (${this.id})`);
      this.alive = false;
      delete step[this.id];
      delete draw[this.id];
      delete this.x;
      delete this.y;
      delete this.id;
    }
  }

  prepare() {
    if (mouse_x >= this.x - this.collider_width / 2 && mouse_x <= this.x + this.collider_width / 2 && mouse_y >= this.y - this.collider_height / 2 && mouse_y <= this.y + this.collider_height / 2) {
      if (mouse_pressed && this.pressed !== undefined) {
        this.pressed();
      }
      if (mouse_click && this.clicked !== undefined) {
        this.clicked();
      }
    }
  }
}

/** 해당 이름을 가진 객체를 세계에서 제거합니다 */
function instance_destroy(object_name) {
  if (!!instances[object_name]) {
    for (let index in instances[object_name]) {
      let _item = instances[object_name][index];
      _item.destroy();
    }
  }
}

function instance_create(object, x, y) {
  let ins = new object();
  ins.x = x;
  ins.y = y;
  return ins;
}

function set_collider(ins, width, height) {
  ins.collider_width = width;
  ins.collider_height = height;
}
