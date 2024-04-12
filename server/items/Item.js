export class Item {
	properties = {};
	constructor(datas, player) {
		this.owner = player;
		this.id = datas.id;
		this.behavior = datas.behavior;
	}

	update(addArgs = {}) {
		this.behavior.default(this, this.owner, addArgs);
	}

	on_equip(addArgs = {}) {
		this.behavior.on_equip(this, this.owner, addArgs);
	}

	on_hit(addArgs = {}) {
		this.behavior.on_hit(this, this.owner, addArgs);
	}

	on_death(addArgs = {}) {
		this.behavior.on_death(this, this.owner, addArgs);
	}
}
