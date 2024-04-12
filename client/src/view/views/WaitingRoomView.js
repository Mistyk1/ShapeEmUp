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

		Connection.socket.on(
			'getDifficulties-from-server',
			(difficulties, defaultDifficulty) => {
				const difficultySlider = document.querySelector('.difficulty');
				let i = 0;
				difficultySlider.innerHTML = `
					<h2 class="difficultyDisplay">${defaultDifficulty}</h2>
					<form class="difficulty-slider">
						<div >
							${Object.keys(difficulties).map(
								difficulty => `
										<input type="radio" name="difficulty" id="${difficulty}" value="${difficulty}" ${difficulty == defaultDifficulty ? 'checked' : ''}>
									`
							)}
						</div>
					</form>
				`;
				const difficultyOptions = difficultySlider.querySelectorAll('input');
				difficultyOptions.forEach(difficulty =>
					difficulty.addEventListener('input', event => {
						Connection.socket.emit('difficulty change', event.target.value);
					})
				);

				Connection.socket.on('difficulty update', difficultyValue => {
					difficultyOptions.forEach(difficulty => {
						difficulty.checked = difficulty.id == difficultyValue;
					});
					difficultySlider.querySelector('.difficultyDisplay').innerHTML =
						difficultyValue;
				});
			}
		);
	}
}
