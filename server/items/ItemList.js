export const itemList = {
	bottle: {
		// Donne de la régénération au joueur
		id: 0,
		behavior: {
			default: (item, player, addArgs) => {},
			on_equip: (item, player, addArgs) => {
				player.stats.regen.amount += 2;
			},
			on_hit: (item, player, addArgs) => {},
			on_death: (item, player, addArgs) => {},
		},
	},
	shoes: {
		// Augmente la vitesse du joueur
		id: 1,
		behavior: {
			default: (item, player, addArgs) => {},
			on_equip: (item, player, addArgs) => {
				player.stats.speed *= 1.1;
			},
			on_hit: (item, player, addArgs) => {},
			on_death: (item, player, addArgs) => {},
		},
	},
	spike: {
		// Lorsque le joueur est blessé, blesse l'ennemi qui l'a blessé avec la même quantité de dégâts
		id: 2,
		behavior: {
			default: (item, player, addArgs) => {},
			on_equip: (item, player, addArgs) => {},
			on_hit: (item, player, addArgs) => {
				addArgs.source.hit(addArgs.damage);
			},
			on_death: (item, player, addArgs) => {},
		},
	} /*
	prism: {
		// Créer une entité qui tourne autour du joueur. Quand un projectile tiré par le joueur touche le prisme, le projectile se divise en 2 et garde ses propriétés
		id: 3,
		behavior: {
			default: (item, player, addArgs) => {
				item.properties.rotation = (item.properties.rotation + 1) % 360;
				console.log(item.properties.rotation);
			},
			on_equip: (item, player, addArgs) => {
				item.properties.clonedProjectiles = [];
				item.properties.rotation = 0;
			},
			on_hit: (item, player, addArgs) => {},
			on_death: (item, player, addArgs) => {},
		},
	},*/,
};

export function randomItem() {
	const item =
		Object.values(itemList)[
			Math.floor(Math.random() * Object.values(itemList).length)
		];
	return item;
}
