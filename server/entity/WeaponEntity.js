import { Entity } from './Entity.js';
import gameArea from '../GameArea.js';

export class WeaponEntity extends Entity {
	static monsterNb = 0;
	static maxMonster = 25;

	constructor(x, y, weapon) {
		super({
			pos: { x: x, y: y },
			radius: 20,
		});
		this.type = 'weapon';
		this.weapon = weapon;
		this.hitbox.addLayer('weapon');
		this.name = weapon.texture;
		this.ttl = 500;
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.pos.x + this.radius.x / 2, this.pos.y + this.radius.y / 2);
		ctx.lineTo(this.pos.x - this.radius.x / 2, this.pos.y + this.radius.y / 2);
		ctx.lineTo(this.pos.x, this.pos.y - this.radius.y / 2);
		ctx.fill();
		this.hitbox.render(ctx);
	}

	update() {
		this.hitbox.update();
		this.ttl -= 1;
		if (this.ttl <= 0) {
			this.die();
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
