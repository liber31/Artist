/** 게임에서 사용되는 인스턴스의 뼈대입니다 */
class instance {
  constructor() {
    this.id = uuid();
    console.log(`Created instance - ${this.constructor.name} (${this.id})`);

    if (!instances[this.constructor.name]) {
      instances[this.constructor.name] = [];
    }
    instances[this.constructor.name].push(this);

    this.x = 0;
    this.y = 0;

    step[this.id] = this;
    draw[this.id] = this;
  }

  /** 객체의 생사 여부를 결정 짓는 함수입니다 */
  destroy() {
    delete step[this.id];
    delete draw[this.id];
    delete this;
    console.log(`Deleted instance - ${this.constructor.name} (${this.id})`);
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
