import { difficulty } from './Difficulty.js';
import fs from 'fs';
import { Vector2 } from './math/Vector2.js';

class GameArea {
	maxSize = new Vector2(3000, 1800);
	difficulty = difficulty.normal;
	scoreTab = [];
	entities = [];
	delta = 16 / 1000;
	friction = 400;
	gameStarted = false;
	#main_loop;

	add_entity(entity) {
		if (entity.type == 'player') {
			this.scoreTab.push({ name: entity.name, pts: 0 });
			console.log(this.scoreTab);
		}
		this.entities.push(entity);
	}

	start_loop() {
		this.#main_loop = setInterval(
			this.tick_event.bind(this),
			this.delta * 1000
		);
		this.time = 0;
		this.gameStarted = true;
		console.log('loop started');
	}

	end() {
		this.stop_loop();
		this.gameStarted = false;
		fs.readFile('server/datas/scores.json', 'utf8', (err, data) => {
			if (err) {
				console.log(err);
			} else {
				const obj = JSON.parse(data);
				this.scoreTab.forEach(score => obj.push(score));
				const json = JSON.stringify(obj);
				fs.writeFile('server/datas/scores.json', json, 'utf8', () => {
					this.scoreTab = [];
					this.entities = [];
				});
			}
		});
		if (this.io != undefined) this.io.emit('game-end', this.scoreTab);
	}

	stop_loop() {
		clearInterval(this.#main_loop);
		console.log('loop stopped');
	}

	tick_event() {
		this.entities.forEach(entity => entity.update());
		this.time += this.delta;
		if (this.no_players_left() || this.time_is_up()) this.end();
		if (this.io != undefined) {
			this.send_entitiesDatas();
			this.send_current_time();
			this.send_players_score();
		}
	}

	get_players() {
		const players = this.entities.filter(entity => entity.type == 'player');
		return players;
	}

	no_players_left() {
		return this.get_players().length == 0;
	}

	time_is_up() {
		return this.time >= 60 * 5;
	}

	add_score(name, value) {
		this.scoreTab
			.filter(score => score.name == name)
			.map(score => (score.pts += value * this.difficulty));
	}

	set_io(io) {
		this.io = io;
	}

	send_entitiesDatas() {
		const datas = this.entities.map(entity => {
			return {
				origin: { x: entity.pos.x, y: entity.pos.y },
				radius: entity.radius,
				angle: entity.angle,
				name: entity.name,
				type: entity.type,
				maxHP: entity.maxHP,
				HP: entity.HP,
				stats: entity.type == 'player' ? entity.stats : {},
				owner: entity.owner.name,
			};
		});
		this.io.emit('update-entities', datas);
	}

	send_current_time() {
		this.io.emit('getTime-from-server', this.time);
	}

	send_players_score() {
		this.io.emit('getPlayersScore-from-server', this.scoreTab);
	}
}

export default new GameArea();
