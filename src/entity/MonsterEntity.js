import { LivingEntity } from './LivingEntity.js';
import { player } from '../main.js';
import { Action } from './action/Action.js';
import { SpawnerEntity } from './SpawnerEntity.js';
import { Vector2 } from '../math/Vector2.js';

export class MonsterEntity extends LivingEntity {
	constructor(datas, pl) {
		super(datas);
		if (pl) {
			this.playerAggro = pl;
		} else {
			this.playerAggro = player;
		}
		this.maxHP = this.maxHP * this.difficulty;
		this.HP = this.maxHP;
		this.damage = this.damage * this.difficulty;
		this.speedMult = this.speedMult * this.difficulty;
		this.hitCooldown = 0;
		this.hitbox.addLayer('monster');
		this.hitbox.addMask(
			'player',
			new Action('hurtplayer', (source, target) => {
				if (source.hitCooldown <= 0) {
					target.hurt(source.damage);
					source.hitCooldown = 10;
				}
			})
		);
	}

	update() {
		this.move();
		super.update();
		this.is_moving();
		this.hitCooldown -= 1;
	}

	move() {
		const v = new Vector2(
			this.playerAggro.pos.x - this.pos.x,
			this.playerAggro.pos.y - this.pos.y
		);
		this.apply_impulse_vector(v.limit_distance(this.speedMult * this.speed));
	}

	die() {
		super.die();
		SpawnerEntity.monsterNb -= 1;
	}
}
