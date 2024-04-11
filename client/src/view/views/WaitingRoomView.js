import { View, setNavigationToHref } from './View.js';
import { avatarsList } from '../rendering/textures.js';
import Connection from '../../Connection.js';
import { Router } from './Router.js';
import { Renderer } from '../rendering/Renderer.js';
import { KeyBoardControls } from '../../controller/KeyboardControls.js';

export class WaitingRoomView extends View {
	#buttonsize = { x: 200, y: 200 };
	constructor(element) {
		super(element);
		const avatarListContainer = this.element.querySelector('.avatars-list');
		Object.keys(avatarsList).forEach(avatarName => {
			avatarListContainer.innerHTML += `<canvas class="${avatarName}">`;
		});

		Object.entries(avatarsList).forEach(avatar => {
			const [avatarName, datas] = avatar;
			const canvas = avatarListContainer.querySelector(`.${avatarName}`);

			canvas.addEventListener('click', event => {
				event.preventDefault();
				Connection.socket.emit('selection avatar', {
					avatar: avatarName,
					playerNickname: sessionStorage.getItem('nickname'),
				});
			});

			canvas.width = this.#buttonsize.x;
			canvas.height = this.#buttonsize.y;
			const ctx = canvas.getContext('2d');
			datas.draw(
				ctx,
				{ x: canvas.width / 2, y: canvas.height / 2 },
				50,
				-Math.PI / 2,
				0,
				0,
				{ xp: { amount: 0, toLevelUp: 0 }, level: 0 }
			);
		});

		const difficultySlider = this.element.querySelector('.difficulty');
		difficultySlider.addEventListener('input', event => {
			Connection.socket.emit('difficulty change', event.target.value);
		});

		const launchButton = this.element.querySelector('.launch');
		launchButton.removeEventListener('click', setNavigationToHref);
		launchButton.addEventListener('click', event => {
			event.preventDefault();
			Connection.socket.emit('launch');
		});

		const disconnectButton = this.element.querySelector('.disconnect');
		disconnectButton.removeEventListener('click', setNavigationToHref);
		disconnectButton.addEventListener('click', event => {
			event.preventDefault();
			Connection.disconnect();
		});
	}

	static initConnectionToWaitingRoom() {
		const difficultySlider = document.querySelector('.difficulty');
		const difficultyDisplay = document.querySelector('.difficulty-display');
		Connection.socket.on('difficulty update', difficulty => {
			switch (difficulty) {
				case '0':
					difficultyDisplay.innerHTML = 'DIFFICULTY : EASY';
					break;
				case '1':
					difficultyDisplay.innerHTML = 'DIFFICULTY : NORMAL';
					break;
				case '2':
					difficultyDisplay.innerHTML = 'DIFFICULTY : HARD';
					break;
				default:
					break;
			}
			difficultySlider.value = difficulty;
		});

		Connection.socket.on('launch fail', () => console.log('launch fail'));
		Connection.socket.on('launch success', () => {
			Router.navigate('/main-game');
			Renderer.start_rendering();
			KeyBoardControls.startListening();
			console.log('start rendering');
		});
		Connection.socket.on('avatar selection update', avatarsAssociations => {
			const currentUser = sessionStorage.getItem('nickname');
			Object.entries(avatarsAssociations).forEach(association => {
				const [avatarLabel, playerNickname] = association;
				avatarsList[avatarLabel].owner = playerNickname;
				const canvas = document.querySelector(`.avatars-list .${avatarLabel}`);
				canvas.classList.remove('selected-by-other');
				canvas.classList.remove('selected-by-me');
				if (playerNickname == currentUser) {
					canvas.classList.add('selected-by-me');
				} else if (playerNickname != null) {
					canvas.classList.add('selected-by-other');
				}
			});
		});
	}
}
