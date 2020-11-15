//#CodeStart
class rectangle {
  constructor(x1, y1, x2, y2) {
    this.graphics = new PIXI.Graphics();
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = 0xFFFFFF;
    this.fill = false;
    this.alpha = 1;
    this.angle = 0;
  }
  
  set_color(color) {
    this.color = color;
  }
  
  set_fill(bool) {
    this.fill = bool;
  }
  
  set_alpha(alpha) {
    this.alpha = alpha;
  }
  
  set_angle(angle) {
    this.angle = angle;
  }
  
  draw() {
    this.graphics.clear();
    this.graphics.alpha = this.alpha;
    this.graphics.rotation = this.angle;
    if (this.fill === true) {
      this.graphics.beginFill(this.color);      
    } else {
      this.graphics.lineStyle(1, this.color);
    }
    this.graphics.drawRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
  }
}
