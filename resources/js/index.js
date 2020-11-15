try {

const artist = new ArtistEngine();
//artist.set_screen_size(100, 100);
artist.set_fullscreen();
artist.set_debug_mode();
artist.start();

class text extends ArtistObject {
  create() {
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });
    this.basicText = new PIXI.Text(this.depth, style);
    this.basicText.anchor.set(0.5, 0.5);
    this.basicText.alpha = 1;
  }
  
  update() {
    this.basicText.x = this.x;
    this.basicText.y = this.y;
    this.basicText.rotation += 0.05;
  }
  
  draw_call() {
    return [
      this.basicText
    ]
  }
}

class title extends ArtistObject {
    create() {
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });
    this.basicText = new PIXI.Text('Basic', style);
//    this.basicText.anchor.set(0.5, 0.5);
    this.basicText.alpha = 1;
    this.rect = new rectangle(0, 0, 100, 100);
  }
  
  update() {
    this.basicText.x = this.x + 10;
    this.basicText.y = this.y + 10;
    this.rect.x1 += (200 - this.rect.x1) / 8;
    this.rect.x2 += (300 - this.rect.x2) / 8;
    this.rect.set_fill(true);
    this.rect.set_alpha(0.5);
    this.rect.set_angle(20);
  }
  
  draw_call() {
    return [
      this.rect,
      this.basicText,
    ]
  }
}

const title_ins = artist.instance_create(title, 0, 0, -1);

} catch(err) {
  alert(err.stack);
}