class temp extends instance {
  constructor() {
    super();

    this.x = 100;
  }

  step(canvas) {
    this.x = mouse_x;
    this.y = mouse_y;
    if (this.x > canvas.width / 2) {
      console.log('delete');
      this.destroy();
    }
  }

  draw(canvas) {
    const fpsCounter = canvas.getContext('2d');
    fpsCounter.font = '15px Arial';
    fpsCounter.textAlign = 'center';
    fpsCounter.fillText(mouse_click, this.x, this.y);
  }

  adds() {
    this.x += 20;
  }
}

let ins = new temp();
