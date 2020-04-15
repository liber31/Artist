room['game'] = async function() {
  // set_fullscreen();
  class char extends instance {
    constructor() {
      super();
    }

    create() {
      this.goto_x = this.x;
      this.goto_y = this.y;
    }

    step() {
      if (this.x > canvas.width / 2) {
        // instance_destroy('temp');
        room_goto('lobby');
      }
      if (keyboard_check) {
        switch (keyboard_code) {
          case 37:
            this.x -= 2;
            this.xscale = -1;
            break;

          case 39:
            this.x += 2;
            this.xscale = 1;
            break;

          case 38:
            this.y -= 2;
            break;

          case 40:
            this.y += 2;
            break;
        }
      }
      if (mouse_pressed) {
        this.goto_x = mouse_x;
        this.goto_y = mouse_y;
      }
      this.x += (this.goto_x - this.x) / 12;
      this.y += (this.goto_y - this.y) / 12;
    }

    draw() {
      draw_set_color('black');
      draw_set_alpha(0.5);
      draw_line_width(width / 2, 0, width / 2, height, 10);

      draw_set_alpha(1);
      draw_set_font(20, 'Arial');
      draw_text_transformed(this.x, this.y + 20, 'you', 'center');
      draw_sprite_ext(this.x, this.y, 'char', 'center', this.xscale * 0.5, 0.5);
    }

    adds() {
      this.x += 20;
    }
    pressed() {
      this.y += 20;
    }
  }

  class sign extends instance {
    constructor() {
      super();
    }

    draw() {
      draw_set_color('black');
      draw_set_font(20, 'Arial');
      draw_text_transformed(this.x, this.y + 50, 'SIGN', 'center');
      draw_set_alpha(1);
      draw_sprite_ext(this.x, this.y, 'char', 'center', this.xscale, 1);
    }

    adds() {
      this.x += 20;
    }
    pressed() {
      this.y += 20;
      this.xscale *= -1;
    }
  }

  class board extends instance {
    constructor() {
      super();
    }

    draw() {
      draw_set_alpha(1);
      draw_set_color(c_black);
      draw_rectangle(view_x, view_y, view_x + width, view_y + height, true);
      draw_set_alpha(0.5);
      draw_set_color(c_white);
      draw_rectangle(0, 0, width, height, true);
      draw_set_alpha(1);
    }
  }

  class pointer extends instance {
    constructor() {
      super();
    }

    draw() {
      this.x += (mouse_x - this.x) / 3;
      this.y += (mouse_y - this.y) / 3;
      if (this.x > ins.x) {
        this.xscale = -1;
      }
      if (this.x < ins.x) {
        this.xscale = 1;
      }
      draw_set_color('black');
      draw_set_alpha(1);
      draw_sprite_ext(this.x, this.y, 'char', 'center', this.xscale * 2, 2);
      draw_set_font(15, 'Arial');
      draw_set_color(c_white);
      draw_text_transformed(this.x, this.y + 24, 'POINTER', 'center');
      draw_set_color('black');
    }
  }

  sprite_load('img/char.png', 'char');
  instance_create(board, 0, 0, 1);
  let point = instance_create(pointer, 0, 0, 4);
  let ins = instance_create(char, 100, 100, 3);
  ins4 = instance_create(sign, 50, 50, 2);
  set_collider(ins4, 50, 50);
  set_collider(ins, 50, 50);
  set_view_target_instance(ins);
};
