import { DynamicEntity } from './DynamicEntity.js';
import gameArea from '../GameArea.js';
import { Action } from './action/Action.js';
import { Vector2 } from '../math/Vector2.js';
import { randomWeapon, weaponList } from '../weapons/WeaponList.js';
import { WeaponEntity } from './WeaponEntity.js';

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
				if (
					source.memory[target.id] == undefined ||
					source.memory[target.id] <= 0
				) {
					if (source.owner != undefined)
						target.knockback = source.owner.pos
							.to(target.pos)
							.normalize()
							.multiply(this.knockback_speed);

					if (target.hurt(source.damage)) {
						gameArea.add_score(source.owner.name, 5);
						if (Math.random() * 100 < 3) {
							gameArea.add_entity(
								new WeaponEntity(target.pos.x, target.pos.y, randomWeapon())
							);
						}
					}
					if (source.penetration < 0) return;
					if (source.penetration > 0) {
						source.penetration -= 1;
						source.memory[target.id] = source.cooldown;
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
