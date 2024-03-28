import { Entity } from './Entity.js';
import { Vector2 } from '../math/Vector2.js';

export class DynamicEntity extends Entity {
	vectors = [];

	constructor(datas) {
		super(datas);
		this.velocity = new Vector2(0, 0);
		if (datas.speedMult) {
			this.speedMult = datas.speedMult;
		} else {
			this.speedMult = 1;
		}
	}

	update() {
		this.vectors.forEach(v => {
			this.velocity = this.velocity.add(v);
		});
		this.vectors = [];
		this.pos = this.pos.add(this.velocity);
		super.update();
	}

	apply_impulse_vector(vector) {
		this.vectors.push(vector);
	}

	apply_vector_once(vector) {
		this.pos.add(vector);
	}
}
