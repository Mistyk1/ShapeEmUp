import Connection from '../../Connection.js';
import { MouseControls } from '../../controller/MouseControls.js';
import { avatarsList, bulletsList, monsters, weapons } from './textures.js';

export class Renderer {
	static #entities;
	static time;
	static playersScore = [];
	static canvas;
	static context;
	static #reqAnim;

	static w_ratio;
	static h_ratio;

	static set_canvas(canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
		const canvasResizeObserver = new ResizeObserver(resampleCanvas.bind(this));
		canvasResizeObserver.observe(this.canvas);
		function resampleCanvas() {
			this.canvas.width = this.canvas.clientWidth;
			this.canvas.height = this.canvas.clientHeight;
		}
	}

	static start_rendering() {
		if (this.context == undefined) throw new Error('context is null !');
		this.clear();
		this.#renderEntities();
		this.#renderTime();
		this.#renderPlayersScore();
		this.#reqAnim = requestAnimationFrame(this.start_rendering.bind(this));
	}

	static stop_rendering() {
		window.cancelAnimationFrame(this.#reqAnim);
	}

	static clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	static #renderEntities() {
		if (this.#entities != undefined)
			this.#entities.forEach(entity => {
				if (entity.name == undefined) return;
				switch (entity.type) {
					case 'player':
						this.context.scale(this.w_ratio, this.h_ratio);
						Object.values(avatarsList)
							.filter(avatar => avatar.owner == entity.name)
							.map(avatar => {
								console.log(entity);
								avatar.draw(
									this.context,
									entity.origin,
									entity.radius,
									-entity.angle,
									entity.maxHP,
									entity.HP,
									entity.stats
								);
							});
						break;
					case 'bullet':
						this.context.scale(this.w_ratio, this.h_ratio);
						bulletsList[entity.name].draw(
							this.context,
							entity.origin,
							entity.radius,
							Object.values(avatarsList)
								.filter(avatar => avatar.owner == entity.owner)
								.map(avatar => avatar.color)
						);
						break;
					case 'weapon':
						this.context.scale(this.w_ratio, this.h_ratio);
						weapons[entity.name].draw(
							this.context,
							entity.origin,
							entity.radius
						);
						break;
					case 'monster':
						this.context.scale(this.w_ratio, this.h_ratio);
						monsters[entity.name].draw(
							this.context,
							entity.origin,
							entity.radius,
							entity.maxHP,
							entity.HP
						);
						break;
					default:
						break;
				}
			});
	}

	static #renderTime() {
		this.context.font = '30px Arial';
		this.context.fillStyle = 'white';
		const sec = Math.floor(this.time) % 60;
		this.context.fillText(
			`${Math.floor(Math.floor(this.time) / 60)}:${sec < 10 ? `0${sec}` : sec}`,
			50,
			100
		);
	}

	static #renderPlayersScore() {
		this.context.font = '30px Arial';
		this.context.fillStyle = 'white';
		let txt = ``;
		this.playersScore.forEach(player => {
			txt += `${player.name}: ${player.pts} `;
		});
		this.context.fillText(txt, 50, 50);
	}

	static initConnectionToRenderer() {
		Connection.socket.on('getGameSize-from-server', gameSize => {
			const maxWidth = window.innerWidth;
			const maxHeight = window.innerHeight;

			let window_ratio = maxWidth / maxHeight;
			let game_ratio = gameSize.x / gameSize.y;

			if (window_ratio >= game_ratio) {
				this.canvas.height = maxHeight;
				this.canvas.width = maxHeight * game_ratio;
			} else {
				this.canvas.height = maxWidth / game_ratio;
				this.canvas.width = maxWidth;
			}

			this.w_ratio = this.canvas.width / gameSize.x;
			this.h_ratio = this.canvas.height / gameSize.y;
		});
		Connection.socket.on('update-entities', entities => {
			this.#entities = entities;
		});
		Connection.socket.on('getTime-from-server', time => {
			this.time = time;
		});
		Connection.socket.on('getPlayersScore-from-server', scoreTab => {
			this.playersScore = [];
			scoreTab.forEach(score => {
				this.playersScore.push(score);
			});
		});
	}
}
