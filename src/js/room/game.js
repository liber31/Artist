room['game'] = async function() {
  class temp2 extends instance {
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
      // if (mouse_pressed) {
      //   if (mouse_x > this.x - 10 && mouse_x < this.x + 10 && mouse_y > this.y - 10 && mouse_y < this.y + 10) {
      //     alert('clicked');
      //     draw_color = 'green';
      //   }
      // }
    }

    draw() {
      draw_set_alpha(0.2);
      draw_set_color(c_red);
      draw_rectangle(this.x - 25, this.y - 25, this.x + 25, this.y + 25, true);
      draw_set_color('black');
      draw_set_alpha(0.5);
      draw_line_width(canvas.width / 2, 0, canvas.width / 2, canvas.height, 10);
      draw_set_font(20, 'Arial');
      draw_text_transformed(this.x, this.y + 20, 'character', 'center');
      draw_set_alpha(0.2);
      draw_circle(this.x, this.y, 50, true);
      draw_set_alpha(1);
      draw_sprite_ext(this.x, this.y, 'char', 'center', 0.5, 0.5);
    }

    adds() {
      this.x += 20;
    }
    pressed() {
      this.y += 20;
    }
  }

  sprite_load('img/char.png', 'char');
  let ins = instance_create(temp2, 100, 100, 1);
  ins2 = instance_create(temp2, 130, 100, 2);
  ins3 = instance_create(temp2, 150, 100, 3);
  set_collider(ins, 50, 50);

  // let socket = io('http://localhost:3001');
  // socket.on('connect', function() {
  //   console.log('[Socket.io connected]');
  // });
  // socket.on('disconnect', function() {
  //   console.log('[Socket.io disconnected]');
  // });
  // await request('http://localhost:3001/test', { test: 'hello world' });
};
