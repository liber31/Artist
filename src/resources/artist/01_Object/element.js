import { uuid } from "../99_Util/uuid.js";

//#CodeStart

export class ArtistElement {
	constructor(depth, x, y) {
		this.alive = true;
		this.id = uuid();
		if (!window.variables.INSTANCES[depth]) {
			window.variables.INSTANCES[depth] = {};
		}

		if (!window.variables.INSTANCES[depth][this.constructor.name]) {
			window.variables.INSTANCES[depth][this.constructor.name] = [];
		}
		window.variables.INSTANCES[depth][this.constructor.name][this.id] = this;

		this.x = x;
		this.y = y;
		this.xscale = 1;
		this.yscale = 1;
		this.collider_width = 0;
		this.collider_height = 0;
		this.depth = depth;
	}

	async destroyProcess() {
		if (this.alive === true) {
			if (this.destroy !== undefined) {
				await this.destroy();
			}

			this.alive = false;
			delete this.x;
			delete this.y;
			delete this.id;
			delete this.collider_width;
			delete this.collider_height;
			delete window.variables.INSTANCES[this.depth][this.constructor.name][this.id];
		}
	}

	async prepare() {
		if (window.variables.MOUSE_PRESSED && this.pressedGlobal !== undefined) {
			await this.pressedGlobal();
		}
		if (window.variables.MOUSE_CLICK && this.clickGlobal !== undefined) {
			await this.clickGlobal();
		}

		if (this.collider_width !== 0 && this.collider_height !== 0) {
			if (
				window.variables.MOUSE_X >= this.x - this.collider_width / 2 &&
				window.variables.MOUSE_X <= this.x + this.collider_width / 2 &&
				window.variables.MOUSE_Y >= this.y - this.collider_height / 2 &&
				window.variables.MOUSE_Y <= this.y + this.collider_height / 2
			) {
				if (window.variables.MOUSE_PRESSED && this.pressedMe !== undefined) {
					await this.pressedMe();
				}
				if (window.variables.MOUSE_CLICK && this.clickMe !== undefined) {
					await this.clickMe();
				}
			}
		}
	}

	async update() { }

	async draw() { }
}

/** @description 해당 이름을 가진 객체를 세계에서 제거합니다 */
export function instanceDestroy(object_name) {
	if (typeof object_name === 'object' && object_name.destroyProcess !== undefined) {
		object_name.destroyProcess();
	}

	for (let depth in window.variables.INSTANCES) {
		for (let object in window.variables.INSTANCES[depth][object_name]) {
			let _item = window.variables.INSTANCES[depth][object_name][object];
			_item.destroyProcess();
			delete window.variables.INSTANCES[depth][object_name][object];
		}
	}
}

export function instanceCreate(object, x, y, depth) {
	if (depth === undefined) {
		depth = 0;
	}

	let ins = new object(depth, x, y);
	if (ins.create !== undefined) {
		ins.create();
	}
	return ins;
}
