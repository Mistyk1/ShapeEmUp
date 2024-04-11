export class Item {
	constructor(datas, player) {
		this.owner = player;
		this.id = datas.id;
		this.behavior = datas.behavior;
	}

	update() {
		this.behavior.default(this.owner);
	}

	on_equip() {
		this.behavior.on_equip(this.owner);
	}

	on_death() {
		this.behavior.on_death(this.owner);
	}
}
