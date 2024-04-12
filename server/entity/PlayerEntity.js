import { LivingEntity } from './LivingEntity.js';
import gameArea from '../GameArea.js';
import { Vector2 } from '../math/Vector2.js';
import { Action } from './action/Action.js';
import { weaponType } from '../weapons/WeaponType.js';
import { weaponList } from '../weapons/WeaponList.js';
import { Weapon } from '../weapons/Weapon.js';
import { Item } from '../items/Item.js';
import { itemList } from '../items/ItemList.js';

export class PlayerEntity extends LivingEntity {
	// Movement
	direction = new Vector2(0, 0);
	shootDirection = new Vector2(0, 0);
	cursorPosition = new Vector2(0, 0);
	move_vector = new Vector2(0, 0);
	mouseState = { z: false, q: false, s: false, d: false, space: false };
	accel = 400;
	// Stats
	static #xp = { amount: 0, toLevelUp: 100 };
	stats = {
		speed: 20,
		regen: { amount: 0, cooldown: 100 },
		xp: PlayerEntity.#xp,
		level: 1,
		shoot_cooldown: 0,
	};
	// Inventory
	weapons = {
		active1: weaponList.null,
		active2: weaponList.null,
		passive: weaponList.null,
		ultimate: weaponList.null,
	};
	items = [];

	constructor(datas, socket) {
		super(datas);
		this.type = 'player';
		this.hitbox.addLayer('player');
		this.hitbox.addMask(
			'weapon',
			new Action('pickWeapon', (source, target) => {
				Object.values(source.weapons).forEach(w => {
					if (w.id == target.weapon.id) return;
				});
				if (target.weapon.type == weaponType.active) {
					if (source.weapons.active1 == weaponList.null) {
						source.weapons.active1 = new Weapon(target.weapon, source);
						target.die();
					} else if (source.weapons.active2 == weaponList.null) {
						source.weapons.active2 = new Weapon(target.weapon, source);
						target.die();
					}
				} else if (
					source.weapons.passive == weaponList.null &&
					target.weapon.type == weaponType.passive
				) {
					source.weapons.passive = new Weapon(target.weapon, source);
					target.die();
					source.shoot_passive();
				} else if (
					source.weapons.ultimate == weaponList.null &&
					target.weapon.type == weaponType.ultimate
				) {
					source.weapons.ultimate = new Weapon(target.weapon, source);
					target.die();
				}
			})
		);

		this.weapons.active1 = new Weapon(
			{
				id: weaponList.normal.gun.id,
				type: weaponList.normal.gun.type,
				cooldown: weaponList.normal.gun.cooldown,
				bullet: {
					radius: weaponList.normal.gun.bullet.radius,
					speedMult: weaponList.normal.gun.bullet.speedMult,
					friendly: true,
					damage: weaponList.normal.gun.bullet.damage,
					knockback_speed: weaponList.normal.gun.bullet.knockback_speed,
					penetration: weaponList.normal.gun.bullet.penetration,
					ttl: weaponList.normal.gun.bullet.ttl,
					texture: weaponList.normal.gun.bullet.texture,
				},
				texture: weaponList.normal.gun.texture,
			},
			this
		);

		this.equip_item(itemList.prism);

		this.socket = socket;
		if (this.socket != undefined) {
			this.socket.on('disconnect', () => {
				this.die();
			});

			this.socket.on('keyboardEvent', keyboardEvent => {
				this.direction = new Vector2(0, 0);
				this.direction.x = -(keyboardEvent.q - keyboardEvent.d);
				this.direction.y = -(keyboardEvent.z - keyboardEvent.s);
				this.direction = this.direction.normalize();
			});

			this.socket.on('MouseCoordsEvent', coords => {
				this.cursorPosition = new Vector2(coords.x, coords.y);
			});

			this.socket.on('MouseControlsEvent', controls => {
				this.mouseState = controls;
			});
		}
	}

	update() {
		super.update();
		Object.values(this.weapons).forEach(element => {
			if (element != weaponList.null) {
				element.update();
			}
		});
		this.items.forEach(item => {
			item.update();
		});
		this.apply_stats();
		this.move(gameArea.delta, gameArea.friction);
		this.apply_impulse_vector(this.move_vector);
		super.update();

		if (this.stats.shoot_cooldown <= 0) {
			if (this.mouseState.left) {
				this.shoot(0);
			} else if (this.mouseState.right) {
				this.shoot(1);
			} else if (this.mouseState.middle) {
				this.shoot(2);
			}
		}
	}

	apply_velocity() {
		const nextPos = Vector2.sum([this.pos, this.velocity]);
		if (nextPos.x - this.radius < 0)
			this.velocity.x -= this.pos.x - this.radius;
		if (nextPos.y - this.radius < 0)
			this.velocity.y -= this.pos.y - this.radius;
		if (nextPos.x + this.radius > gameArea.maxSize.x)
			this.velocity.x += gameArea.maxSize.x - nextPos.x - this.radius;
		if (nextPos.y + this.radius > gameArea.maxSize.y)
			this.velocity.y += gameArea.maxSize.y - nextPos.y - this.radius;
		this.apply_vector_once(this.velocity);
	}

	move(delta, friction) {
		if (this.direction.distance() == 0) {
			if (this.move_vector.distance() > delta * friction) {
				this.move_vector.substract(
					this.move_vector.normalize().multiply(delta * friction)
				);
			} else {
				this.move_vector = new Vector2(0, 0);
			}
		} else {
			this.move_vector.add(this.direction.multiply(this.accel * delta));
			this.move_vector = this.move_vector.limit_distance(
				this.speedMult * this.stats.speed
			);
		}
	}

	shoot(bool) {
		const w = [weaponList.null, weaponList.null, weaponList.null];
		if (bool == 0 && this.weapons.active1 != weaponList.null) {
			w[0] = this.weapons.active1;
		}
		if (bool == 1 && this.weapons.active2 != weaponList.null) {
			w[1] = this.weapons.active2;
		}
		if (bool == 2 && this.weapons.ultimate != weaponList.null) {
			w[2] = this.weapons.ultimate;
		}
		w.forEach(weapon => {
			if (weapon != weaponList.null) {
				weapon.bullet.pos = this.pos;
				const bullet = weapon.shoot();
				if (bullet != undefined) {
					bullet.trajectory = this.pos
						.to(this.cursorPosition)
						.normalize()
						.multiply(bullet.speedMult);
					gameArea.entities.push(bullet);
				}
			}
		});
	}

	shoot_passive() {
		if (this.weapons.passive != weaponList.null) {
			this.weapons.passive.bullet.pos = this.pos;
			const bullet = this.weapons.passive.shoot();
			if (bullet != undefined) {
				gameArea.add_entity(bullet);
			}
		}
	}

	die() {
		this.items.forEach(item => {
			item.on_death();
		});
		super.die();
		gameArea.entities.forEach((entity, index) => {
			if (entity.owner.name == this.name) {
				entity.die();
			}
		});
	}

	apply_stats() {
		this.stats.shoot_cooldown -= 1;
		this.stats.regen.cooldown -= 1;
		if (this.stats.regen.cooldown <= 0) {
			this.HP = Math.min(this.HP + this.stats.regen.amount, this.maxHP);
			this.stats.regen.cooldown = 100;
		}
		if (this.stats.xp.amount >= this.stats.xp.toLevelUp) {
			this.stats.xp.amount -= this.stats.xp.toLevelUp;
			this.stats.xp.toLevelUp += 100;
			this.stats.level += 1;
		}
	}

	equip_item(item) {
		if (this.items.length >= 4) {
			return;
		}
		this.items.forEach(equippedItem => {
			if (equippedItem.id == item.id) {
				return;
			}
		});
		const equippedItem = new Item(item, this);
		this.items.push(equippedItem);
		equippedItem.on_equip();
	}
}
