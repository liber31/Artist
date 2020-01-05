room['game'] = async function() {
  sprite_load('img/char.png', 'char');
  let ins = instance_create(char, 100, 100, 2);
  ins4 = instance_create(sign, 50, 50, 1);
  set_collider(ins, 100, 100);
};

class char extends instance {
  constructor() {
    super();
    this.xscale = 1;
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
    draw_sprite_ext(this.x, this.y, 'char', 'center', 1, 1);
  }

  adds() {
    this.x += 20;
  }
  pressed() {
    this.y += 20;
  }
}
