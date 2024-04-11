export const itemList = {
	bottle: {
		id: 0,
		behavior: {
			default: source => {},
			on_equip: source => {
				source.stats.regen.amount += 2;
			},
			on_death: source => {},
		},
	},
};

export function randomItem() {
	const item =
		Object.values(itemList)[
			Math.floor(Math.random() * Object.values(itemList).length)
		];
	return item;
}
