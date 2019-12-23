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
