export class Artist {
    static init(canvasName, width, height) {
        this.screenController = new ScreenController(canvasName, width, height);
        this.spriteController = new SpriteController();
        this.depthController = new DepthController();
        this.inputController = new InputController();
    }
    
    static createElement() {
        const element = new Element();
        return element;
    }
    
    static deleteElement(element) {
        
    }
    
    static start() {
        this.screenController.start();
    }
}

class ScreenController {
    constructor(canvasName, width, height) {
        this.canvas = document.getElementById(canvasName);
        this.screen = document.createElement('canvas');
        this.screen.width = width;
        this.screen.height = height;
        this.deltaTime = 0;
        this.fps = 0;
        this.fpsInterval = Math.floor(1000 / 60);
        this.queue = new Queue();
        this.ratio = window.devicePixelRatio;
        
        this.canvas.style['touch-action'] = 'none';
        this.canvas.style.cursor = 'inherit';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style['touch-action'] = 'none';
        this.canvas.style.cursor = 'inherit';
        this.canvas.width = window.innerWidth * this.ratio;
        this.canvas.height = window.innerHeight * this.ratio;
        this.displayWidth = this.canvas.width;
        this.displayHeight = this.canvas.height;
    }
    
    async render() {
	const ctx = this.screen.getContext('2d');
	ctx.clearRect(0, 0, this.screen.width, this.screen.height);
	ctx.rect(0, 0, this.screen.width, this.screen.height);
	ctx.fillStyle = 'white';
	ctx.fill();

	let targetWidth = 0, targetHeight = 0;
	let letterBoxWidth = 0, letterBoxHeight = 0;
	let resolution = this.getScreenResolution(this.screen.width, this.screen.height);
	
        if (this.canvas.width / resolution.width >= this.canvas.height / resolution.height) {
            targetWidth = (this.canvas.height / resolution.height) * resolution.width;
            targetHeight = this.canvas.height;
            letterBoxWidth = this.canvas.width - targetWidth;
        } else {
            targetWidth = this.canvas.width;
            targetHeight = (this.canvas.width / resolution.width) * resolution.height;
            letterBoxHeight = this.canvas.height - targetHeight;
        }
        this.canvas.width = window.innerWidth * this.ratio;
	this.canvas.height = window.innerHeight * this.ratio;

        while (this.queue.getLength() > 0) {
            await (this.queue.dequeue())(this.screen);
        }
        
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.canvas.getContext('2d').fillStyle = 'black';
	this.canvas.getContext('2d').fillRect(0, 0, this.canvas.width, this.canvas.height);

	this.canvas.getContext('2d').fillStyle = 'white';
	this.canvas.getContext('2d').fillRect(letterBoxWidth / 2, letterBoxHeight / 2, targetWidth, targetHeight);

	this.canvas.getContext('2d').drawImage(
	    this.screen, 0, 0,
	    this.screen.width, this.screen.height,
	    letterBoxWidth / 2, letterBoxHeight / 2,
	    targetWidth, targetHeight);
    }
    
    start() {
        let frameCount = 0;
        let then = performance.now();
        let elapsed = 0;
        
        const frame = async () => {
            const now = performance.now();
            elapsed = now - then;
            then = now - (elapsed % this.fpsInterval);
            try { await this.render(); } catch (err) { alert(err); }
	    frameCount++;
            this.deltaTime = elapsed / 1000;
            requestAnimationFrame(frame);
        }
        
        frame();
        setInterval(() => {
            this.fps = frameCount;
            frameCount = 0;
        }, 1000);        
    }
    
    getScreenResolution(rwidth, rheight) {
        let max, min, temp, gcd, war, har;
        if (rwidth < rheight) { max = rwidth; min = rheight; } else { max = rheight; min = rwidth; }
        while (max % min != 0) { temp = max % min; max = min; min = temp; }
        gcd = min;
        war = rwidth / gcd;
        har = rheight / gcd;
        return { width: war, height: har }
    }
}

class SpriteController {
    
}

class DepthController {
    
}

class InputController {
    
}

class Element {
    constructor() {
        this.queue = new Queue();
    }
    
    async draw(screen) {
        
    }
}

class Queue {
    constructor() {
        this.dataStore = [];
    }
    
    enqueue(element) {
        this.dataStore.push(element);
    }
    
    dequeue() {
        return this.dataStore.shift();
    }
    
    getLength() {
        return this.dataStore.length;
    }
}