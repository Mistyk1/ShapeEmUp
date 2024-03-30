import { Vector2 } from '../math/Vector2.js';
import { LivingEntity } from './LivingEntity.js';
//import { player } from '../main.js';
import { Action } from './action/Action.js';

export class MonsterEntity extends LivingEntity {
	constructor(datas, pl) {
		super(datas);
		if (pl) {
			this.playerAggro = pl;
		} else {
			//	this.playerAggro = player;
		}
		this.hitbox.addLayer('monster');
		this.hitbox.addMask(
			'player',
			new Action('hurtplayer', (source, target) => {
				target.hurt(1);
			})
		);
	}

	update() {
		this.move();
		super.update();
	}

	move() {
		const direction = new Vector2(
			this.playerAggro.pos.x - this.pos.x,
			this.playerAggro.pos.y - this.pos.y
		).normalize();
		console.log(direction);
		this.apply_vector_once(direction);
		console.log(this.pos);
	}
}
