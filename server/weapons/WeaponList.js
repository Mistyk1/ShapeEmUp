import { itemList } from '../items/ItemList.js';
import { weaponType } from './WeaponType.js';

const evolvedWeaponList = {
	// Active weapons
	// Passive weapons
	superZone: {
		id: 50,
		type: weaponType.passive,
		cooldown: 0,
		bullet: {
			radius: 400,
			speedMult: -1,
			friendly: true,
			damage: 5,
			knockback_speed: 15,
			penetration: -1,
			ttl: -1,
			texture: 'superZone_bullet',
		},
		texture: 'superZone',
	},
	// Ultimate weapons
};

export const weaponList = {
	null: -1,
	normal: {
		// Active weapons
		gun: {
			id: 0,
			type: weaponType.active,
			cooldown: 15,
			bullet: {
				radius: 5,
				speedMult: 25,
				friendly: true,
				damage: 100,
				knockback_speed: 30,
				penetration: 1,
				ttl: 50,
				texture: 'gun_bullet',
			},
			texture: 'gun',
		},
		bigGun: {
			id: 1,
			type: weaponType.active,
			cooldown: 50,
			bullet: {
				radius: 12.5,
				speedMult: 10,
				friendly: true,
				damage: 250,
				knockback_speed: 45,
				penetration: 0,
				ttl: 30,
				texture: 'bigGun_bullet',
			},
			texture: 'bigGun',
		},
		// Passive weapons
		zone: {
			id: 2,
			type: weaponType.passive,
			cooldown: 0,
			bullet: {
				radius: 250,
				speedMult: -1,
				friendly: true,
				damage: 2.5,
				knockback_speed: 7.5,
				penetration: -1,
				ttl: -1,
				texture: 'zone_bullet',
			},
			texture: 'zone',
			itemsToEvolve: [itemList.bottle],
			evolution: evolvedWeaponList.superZone,
		},
		// Ultimate weapons
		laser: {
			id: 3,
			type: weaponType.ultimate,
			cooldown: 1,
			bullet: {
				radius: 20,
				speedMult: 50,
				friendly: true,
				damage: 5,
				knockback_speed: 0,
				penetration: -1,
				ttl: 30,
				texture: 'laser_bullet',
			},
			texture: 'laser',
		},
	},
	evolved: evolvedWeaponList,
};

export function randomWeapon() {
	const weapon = Object.values(weaponList.normal)[
		Math.floor(Math.random() * Object.values(weaponList.normal).length)
	];
	return weapon;
}
