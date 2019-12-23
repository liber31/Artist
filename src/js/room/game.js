room['lobby'] = function() {
  class temp extends instance {
    constructor() {
      super();

      this.x = 100;
      this.y = 100;
    }

    step() {
      if (this.x > canvas.width / 2) {
        // instance_destroy('temp');
        room_goto('lobby');
      }
      if (keyboard_check) {
        switch (keyboard_code) {
          case 37:
            this.x--;
            break;

          case 39:
            this.x++;
            break;

          case 38:
            this.y--;
            break;

          case 40:
            this.y++;
            break;
        }
      }
      if (mouse_pressed) {
        if (mouse_x > this.x - 10 && mouse_x < this.x + 10 && mouse_y > this.y - 10 && mouse_y < this.y + 10) {
          alert('clicked');
        }
      }
    }

    draw() {
      draw_text_transformed(this.x, this.y - 15, 'temp', 30, 'center');
      draw_rectangle(this.x - 10, this.y - 10, this.x + 10, this.y + 10, false);
    }

    adds() {
      this.x += 20;
    }
  }

  let ins = new temp();
  let ins2 = new temp();
  ins2.x = 0;
};
