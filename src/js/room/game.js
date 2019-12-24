room['game'] = function() {
  class temp extends instance {
    constructor() {
      super();
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
      if (mouse_pressed) {
        if (mouse_x > this.x - 10 && mouse_x < this.x + 10 && mouse_y > this.y - 10 && mouse_y < this.y + 10) {
          alert('clicked');
          draw_color = 'green';
        }
      }
    }

    draw() {
      draw_alpha = 0.5;
      draw_line_width(canvas.width / 2, 0, canvas.width / 2, canvas.height, 10);
      draw_text_transformed(this.x, this.y - 15, 'temp', 30, 'center');
      // draw_circle(this.x, this.y, 10, true);
      draw_alpha = 1;
      draw_sprite_ext(this.x, this.y, 'char', 'center', 0.5, 0.5);
    }

    adds() {
      this.x += 20;
    }
  }

  sprite_load('img/char.png', 'char');
  instance_create(temp, 100, 100);
};
