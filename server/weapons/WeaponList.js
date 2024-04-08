import { weaponType } from './WeaponType.js';

export const weaponList = {
	null: -1,
	// Active weapons
	gun: {
		type: weaponType.active,
		cooldown: 15,
		bullet: {
			radius: 5,
			speedMult: 25,
			friendly: true,
			damage: 10,
			knockback_speed: 30,
			penetration: 1,
			ttl: 50,
			texture: 'gun_bullet',
		},
		texture: 'gun',
	},
	bigGun: {
		type: weaponType.active,
		cooldown: 50,
		bullet: {
			radius: 12.5,
			speedMult: 10,
			friendly: true,
			damage: 25,
			knockback_speed: 45,
			penetration: 0,
			ttl: 30,
			texture: 'bigGun_bullet',
		},
		texture: 'bigGun',
	},
	// Passive weapons
	zone: {
		type: weaponType.passive,
		cooldown: 0,
		bullet: {
			radius: 250,
			speedMult: -1,
			friendly: true,
			damage: 0.25,
			knockback_speed: 7.5,
			penetration: -1,
			ttl: -1,
			renderTexture: false,
			texture: 'zone_bullet',
		},
		texture: 'zone',
	},
	// Ultimate weapons
	laser: {
		type: weaponType.ultimate,
		cooldown: 1,
		bullet: {
			radius: 20,
			speedMult: 50,
			friendly: true,
			damage: 1,
			knockback_speed: 0,
			penetration: -1,
			ttl: 30,
			texture: 'laser_bullet',
		},
		texture: 'laser',
	},
};

export function randomWeapon() {
	const weapon =
		Object.values(weaponList)[
			Math.floor(1 + Math.random() * Object.values(weaponList).length - 1)
		];
	return weapon;
}
