import { ProjectileEntity } from '../entity/ProjectileEntity.js';

export class Weapon {
	constructor(datas, owner) {
		this.type = datas.type;
		this.maxCooldown = datas.cooldown;
		this.cooldown = 0;
		this.bullet = Object.assign({}, datas.bullet);
		this.bullet.cooldown = this.maxCooldown;
		this.bullet.owner = owner;
	}

	shoot() {
		if (this.cooldown <= 0) {
			this.cooldown = this.maxCooldown;
			return new ProjectileEntity(this.bullet);
		}
	}

	update() {
		this.cooldown -= 1;
	}
}
