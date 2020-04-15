import { instance, draw_set_color, draw_rectangle, instance_create, draw_set_font, draw_text_transformed, draw_set_alpha, lengthdir_x, lengthdir_y, room_goto } from '../artist/index.js';
import { color } from '../artist/config.js';

export function sample() {
    class background extends instance {
        constructor() {
            super();
        }

        step() {
            this.x += 2;
            this.y += 1;
            if (this.y == 70) {
                this.y = 0;
                this.x = 0;
            }

            if (window.variables.mouse_pressed == true) {
                room_goto('sample2');
            }
        }

        draw() {
            draw_set_color(color.gray);
            draw_set_font(23, 'Arial');
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 14; j++) {
                    draw_text_transformed(j * 70 + this.x - 140, this.y + i * 70 - 40, 'sample', 'center', 45);
                }
            }

            draw_set_alpha(0.9);
            draw_set_color(color.white);
            draw_rectangle(window.variables.width / 2 - 155, window.variables.height / 2 - 65, window.variables.width / 2 + 155, window.variables.height / 2 + 52, true);
            draw_set_alpha(1);
            draw_set_color(color.black);
            draw_rectangle(window.variables.width / 2 - 156, window.variables.height / 2 - 66, window.variables.width / 2 + 156, window.variables.height / 2 + 53, false);
        }
    }

    class main_text extends instance {
        constructor() {
            super();
        }

        create() {
            this.text = 'This is sample.js';
            this.time = 0;
        }

        step() {
            this.time += 0.1;
            if (this.time > 6.2) {
                this.time = 0;
            }
        }

        draw() {
            draw_set_color(color.black);
            draw_set_font(40, 'Arial');
            draw_text_transformed(this.x, this.y - 30 + lengthdir_x(10, this.time), this.text, 'center', lengthdir_y(5, this.time));
        }
    }

    class sub_text extends instance {
        constructor() {
            super();
        }

        create() {
            this.text = '화면을 클릭해서 sample2.js로 넘어가보세요';
            this.time = 1;
        }

        step() {
            this.time += 0.1;
            if (this.time > 6.2) {
                this.time = 0;
            }
        }

        draw() {
            draw_set_color(color.black);
            draw_set_font(16, 'Arial');
            draw_text_transformed(this.x, this.y + 20 + lengthdir_x(10, this.time), this.text, 'center', lengthdir_y(5, this.time));
        }
    }

    instance_create(main_text, window.variables.width / 2, window.variables.height / 2, 2);
    instance_create(sub_text, window.variables.width / 2, window.variables.height / 2, 2);
    instance_create(background, 0, 0, 1);
}
