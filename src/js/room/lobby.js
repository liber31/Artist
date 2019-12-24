room['lobby'] = function() {
  class temp extends instance {
    constructor() {
      super();
    }

    step() {
      if (this.x > canvas.width / 2) {
        room_goto('game');
      }
      if (keyboard_check) {
        switch (keyboard_code) {
          case 37:
            this.x -= 2;
            break;

          case 39:
            this.x += 2;
            break;

          case 38:
            this.y -= 2;
            break;

          case 40:
            this.y += 2;
            break;
        }
      }
    }

    draw() {
      //draw_text_transformed(this.x, this.y - 15, 'temp', 'center');
      draw_set_color('black');
      draw_rectangle(this.x - 10, this.y - 10, this.x + 10, this.y + 10, true);
    }

    adds() {
      this.x += 20;
    }
  }

  instance_create(temp, 20, 20, 3);
  let ins = instance_create(temp, 10, 10, 2);
  ins.draw = () => {
    draw_set_color('green');
    draw_rectangle(ins.x - 10, ins.y - 10, ins.x + 10, ins.y + 10, true);
  };
};
