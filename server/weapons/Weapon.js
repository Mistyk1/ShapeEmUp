import { ProjectileEntity } from '../entity/ProjectileEntity.js';
import { itemList } from '../items/ItemList.js';
import { weaponList } from './WeaponList.js';

export class Weapon {
	constructor(datas, owner) {
		this.id = datas.id;
		this.type = datas.type;
		this.maxCooldown = datas.cooldown;
		this.cooldown = 0;
		this.bullet = Object.assign({}, datas.bullet);
		this.bullet.cooldown = this.maxCooldown;
		this.bullet.owner = owner;
		this.itemsToEvolve = datas.itemsToEvolve;
		this.evolution = datas.evolution;
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

	evolve() {
		this.bullet = Object.assign({}, this.evolution.bullet);
		this.bullet.cooldown = this.maxCooldown;
		this.itemsToEvolve = itemList.null;
		this.evolution = weaponList.null;
	}
}
