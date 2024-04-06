import { DynamicEntity } from './DynamicEntity.js';
import gameArea from '../GameArea.js';
import { Action } from './action/Action.js';
import { Vector2 } from '../math/Vector2.js';

export class ProjectileEntity extends DynamicEntity {
	memory = new Map();

	constructor(datas) {
		super(datas);
		this.type = 'bullet';
		this.owner = datas.owner;
		this.penetration = datas.penetration;
		this.trajectory = new Vector2(0, 0);
		this.knockback_speed = datas.knockback_speed;
		this.cooldown = 1;
		this.hitbox.addLayer('bullet');
		this.hitbox.addMask(
			'monster',
			new Action('monsterColision', (source, target) => {
				if (source.memory[target] == undefined || source.memory[target] <= 0) {
					console.log('collision');
					if (source.owner != undefined)
						target.knockback = source.owner.pos
							.to(target.pos)
							.normalize()
							.multiply(this.knockback_speed);

					if (target.hurt(source.damage)) {
						gameArea.add_score(source.owner.name, 5);
					}
					if (source.penetration < 0) return;
					if (source.penetration > 0) {
						source.penetration -= 1;
						source.memory[target] = source.cooldown;
						return;
					}
					source.die();
				}
			})
		);
		this.ttl = datas.ttl;
		this.name = datas.texture;
	}

	update() {
		if (this.ttl > 0) {
			this.ttl -= 1;
			if (this.ttl == 0) {
				this.die();
				return;
			}
		}
		this.memory.forEach((value, key) => {
			this.memory[key] -= 1;
		});
		this.move();
		super.update();
	}

	setAngle(x, y) {
		this.trajectory.x = x;
		this.trajectory.y = y;
	}

	move() {
		if (this.speedMult == -1) {
			this.pos.x = this.owner.pos.x;
			this.pos.y = this.owner.pos.y;
		} else {
			this.apply_impulse_vector(this.trajectory);
		}
	}

	die() {
		gameArea.entities.forEach((entity, index) => {
			if (entity === this) {
				gameArea.entities.splice(index, 1);
			}
		});
	}
}
