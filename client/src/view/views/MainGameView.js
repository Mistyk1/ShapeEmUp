import Connection from '../../Connection.js';
import { Renderer } from '../rendering/Renderer.js';
import { Router } from './Router.js';
import { View } from './View.js';

export class MainGameView extends View {
	constructor(element) {
		super(element);
	}

	static initConnectionToEndScreen() {
		Connection.socket.on('game-end', scores => {
			Renderer.stop_rendering();
			const score = scores
				.filter(score => score.name == sessionStorage.getItem('nickname'))
				.map(score => score.pts);
			console.log(scores);
			const scoreText = document.querySelector('.score');
			scoreText.innerHTML = `Votre score est de ${score}`;
			Router.navigate('/end-screen');
		});
	}
}
