
try {

var app = new PIXI.Application(300, 600, {
//  autoResize: true,
//  resolution: devicePixelRatio,
  backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

var style = new PIXI.TextStyle({
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

var basicText = new PIXI.Text('0', style);
basicText.anchor.set(0.5, 0.5);

app.stage.addChild(basicText);

var richText = new PIXI.Text(devicePixelRatio, style);
richText.x = 50;
richText.y = 250;

app.stage.addChild(richText);

let i = 0;
setInterval(() => {
  i++;
  basicText.text = String(i);
}, 1000);

setInterval(() => {
  basicText.rotation+=0.05;
}, 10);

//window.addEventListener('resize', resize);

// Resize function window
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
  
  // You can use the 'screen' property as the renderer visible
  // area, this is more useful than view.width/height because
  // it handles resolution
  basicText.x = app.screen.width - 50;
  basicText.y = app.screen.height - 50;
}

//resize();

} catch(err) {
  alert(err);
}