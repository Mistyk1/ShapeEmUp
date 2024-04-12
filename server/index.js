import http from 'http';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import gameArea from './GameArea.js';
import { PlayerEntity } from './entity/PlayerEntity.js';
import { WeaponEntity } from './entity/WeaponEntity.js';
import { weaponList } from './weapons/WeaponList.js';
import { SpawnerEntity } from './entity/SpawnerEntity.js';
import { Vector2 } from './math/Vector2.js';
import { difficulties } from './Difficulty.js';

const app = express();
const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };

process.on('uncaughtException', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

let port = process.env.PORT;
if (port == undefined) port = 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

addWebpackMiddleware(app);

app.use(express.static('client/public'));

app.get('/scores', (req, res) => {
	res.sendFile('server/datas/scores.json', fileOptions);
});

const players = [];
const maxPlayers = 4;

const avatarsAssociation = {
	square: null,
	circle: null,
	triangle: null,
	pentagon: null,
};

export const io = new IOServer(httpServer);
io.on('connection', socket => {
	if (players.length == maxPlayers || gameArea.gameStarted) {
		socket.disconnect();
		return;
	}

	const datas = socket.handshake.query;
	if (
		players.filter(player => player.handshake.query.nickname == datas.nickname)
			.length != 0
	) {
		socket.disconnect();
		return;
	}

	players.push(socket);
	console.log(`${datas.nickname} s'est connectée`);
	console.log(players);
	socket.emit('avatar selection update', avatarsAssociation);
	socket.emit('getGameSize-from-server', gameArea.maxSize);
	socket.emit(
		'getDifficulties-from-server',
		difficulties,
		gameArea.defaultDifficulty
	);

	socket.on('disconnect', () => {
		players.removeIf(
			socket => socket.handshake.query.nickname == datas.nickname
		);
		gameArea
			.get_players()
			.removeIf(player => player.nickname == datas.nickname);
		Object.entries(avatarsAssociation).forEach(association => {
			const [avatarLabel, player] = association;
			if (player == datas.nickname) avatarsAssociation[avatarLabel] = null;
		});
		io.emit('avatar selection update', avatarsAssociation);
		console.log(`${datas.nickname} s'est déconnecté(e)`);
		console.log(players);
	});

	socket.on('difficulty change', difficulty => {
		gameArea.difficulty = difficulties[difficulty];
		console.log(gameArea.difficulty);
		io.emit('difficulty update', difficulty);
	});

	socket.on('launch', () => {
		if (
			players.length !=
			Object.values(avatarsAssociation).filter(nickname => nickname != null)
				.length
		) {
			console.log('Not everyone has an avatar');
			socket.emit('launch fail');
			return;
		}
		const hasFailed = init();
		if (hasFailed) {
			console.log('launch fail');
			socket.emit('launch fail');
		} else {
			console.log('launch success');
			io.emit('launch success');
		}
	});

	socket.on('selection avatar', datas => {
		const { avatar, playerNickname } = datas;
		console.log(`${playerNickname} a selectionné l'avatar ${avatar}`);
		if (avatarsAssociation[avatar] == null) {
			Object.entries(avatarsAssociation).forEach(association => {
				const [avatarLabel, player] = association;
				if (player == playerNickname) avatarsAssociation[avatarLabel] = null;
			});
			avatarsAssociation[avatar] = playerNickname;
		}
		io.emit('avatar selection update', avatarsAssociation);
	});
});

gameArea.set_io(io);

Array.prototype.removeIf = function (callback) {
	let i = this.length;
	while (i--) {
		if (callback(this[i], i)) {
			this.splice(i, 1);
		}
	}
};

function init() {
	console.log('initializing game ...');
	gameArea.entities.length = 0;
	const spawnerDatas1 = {
			pos: new Vector2(-50, -50),
		},
		spawnerDatas2 = {
			pos: new Vector2(gameArea.maxSize.x + 50, gameArea.maxSize.y + 50),
		},
		spawnerDatas3 = {
			pos: new Vector2(-50, gameArea.maxSize.y + 50),
		},
		spawnerDatas4 = {
			pos: new Vector2(gameArea.maxSize.x + 50, -50),
		};
	gameArea.add_entity(new SpawnerEntity(spawnerDatas1));
	gameArea.add_entity(new SpawnerEntity(spawnerDatas2));
	gameArea.add_entity(new SpawnerEntity(spawnerDatas3));
	gameArea.add_entity(new SpawnerEntity(spawnerDatas4));
	players.forEach(socket => {
		const player = new PlayerEntity(
			{
				pos: { x: 200, y: 200 },
				radius: 25,
				name: socket.handshake.query.nickname,
				default_hp: 50,
			},
			socket
		);
		console.log(player);
		gameArea.add_entity(player);
	});
	gameArea.start_loop();
	return false;
}

function gracefulShutdown() {
	console.log('Shutting down gracefully...');

	io.close(() => {
		players.length = 0;
		Object.values(avatarsAssociation).length = 0;
		gameArea.stop_loop();
		gameArea.entities.length = 0;
		console.log(players);
		console.log(avatarsAssociation);
	});

	httpServer.close(() => {
		console.log('Server closed.');

		// Close any other connections or resources here

		process.exit(0);
	});

	// Force close the server after 5 seconds
	setTimeout(() => {
		console.error(
			'Could not close connections in time, forcefully shutting down'
		);
		process.exit(1);
	}, 5000);
}
