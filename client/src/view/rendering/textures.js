export const avatarsList = {
	square: {
		color: 'lightblue',
		owner: null,
		draw: (ctx, origin, radius, angle, maxHP, HP) => {
			ctx.fillStyle = avatarsList.square.color;
			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.rotate(angle);
			ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
			ctx.rotate(-angle);

			const hpDisplayWidth = radius * 2 * 1.5 * (HP / maxHP);
			if (hpDisplayWidth <= 0) return;
			ctx.fillRect(
				-radius * 1.5,
				radius * 1.5,
				hpDisplayWidth,
				radius * 2 * 0.15
			);
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	circle: {
		color: 'lightgreen',
		owner: null,
		draw: (ctx, origin, radius, angle, maxHP, HP) => {
			ctx.fillStyle = avatarsList.circle.color;
			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.arc(0, 0, radius, 0, Math.PI * 2);
			ctx.fill();

			const hpDisplayWidth = radius * 2 * 1.5 * (HP / maxHP);
			if (hpDisplayWidth <= 0) return;
			ctx.fillRect(
				-radius * 1.5,
				radius * 1.5,
				hpDisplayWidth,
				radius * 2 * 0.15
			);
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	triangle: {
		color: 'gold',
		owner: null,
		nbSides: 3,
		draw: (ctx, origin, radius, angle, maxHP, HP) => {
			const alpha = (2 * Math.PI) / avatarsList.triangle.nbSides;
			ctx.fillStyle = avatarsList.triangle.color;
			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.rotate(angle);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= avatarsList.triangle.nbSides + 1; i++) {
				ctx.lineTo(radius * Math.cos(i * alpha), radius * Math.sin(i * alpha));
			}
			ctx.rotate(-angle);
			ctx.fill();

			const hpDisplayWidth = radius * 2 * 1.5 * (HP / maxHP);
			if (hpDisplayWidth <= 0) return;
			ctx.fillRect(
				-radius * 1.5,
				radius * 1.5,
				hpDisplayWidth,
				radius * 2 * 0.15
			);
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	pentagon: {
		color: 'lightpink',
		owner: null,
		nbSides: 5,
		draw: (ctx, origin, radius, angle, maxHP, HP) => {
			const aplha = (2 * Math.PI) / avatarsList.pentagon.nbSides;
			ctx.fillStyle = avatarsList.pentagon.color;
			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.rotate(angle);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= avatarsList.pentagon.nbSides + 1; i++) {
				ctx.lineTo(radius * Math.cos(i * aplha), radius * Math.sin(i * aplha));
			}
			ctx.rotate(-angle);
			ctx.fill();

			const hpDisplayWidth = radius * 2 * 1.5 * (HP / maxHP);
			if (hpDisplayWidth <= 0) return;
			ctx.fillRect(
				-radius * 1.5,
				radius * 1.5,
				hpDisplayWidth,
				radius * 2 * 0.15
			);
			ctx.resetTransform();
			ctx.closePath();
		},
	},
};

export const weapons = {
	color: 'white',
	gun: {
		nbSides: 6,
		draw: (ctx, origin, radius) => {
			const alpha = (2 * Math.PI) / weapons.gun.nbSides;
			ctx.strokeStyle = weapons.color;
			ctx.lineWidth = 0.2 * radius;
			ctx.beginPath();
			ctx.translate(origin.x, origin.y);
			ctx.rotate(-Math.PI / 2);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= weapons.gun.nbSides + 1; i++) {
				ctx.lineTo(radius * Math.cos(i * alpha), radius * Math.sin(i * alpha));
			}
			ctx.rotate(-Math.PI / 2);
			ctx.stroke();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	bigGun: {
		nbSides: 8,
		draw: (ctx, origin, radius) => {
			const angle = (2 * Math.PI) / weapons.bigGun.nbSides;
			ctx.strokeStyle = weapons.color;
			ctx.lineWidth = 0.2 * radius;

			ctx.beginPath();
			ctx.translate(origin.x, origin.y);
			ctx.rotate(-Math.PI / 2);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= weapons.bigGun.nbSides + 1; i++) {
				ctx.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
			}
			ctx.rotate(Math.PI / 2);
			ctx.stroke();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	zone: {
		draw: (ctx, origin, radius) => {
			ctx.strokeStyle = weapons.color;
			ctx.lineWidth = 0.2 * radius;

			ctx.beginPath();
			ctx.translate(origin.x, origin.y);
			ctx.arc(0, 0, radius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	laser: {
		nbSides: 3,
		draw: (ctx, origin, radius) => {
			const angle = (2 * Math.PI) / weapons.laser.nbSides;
			ctx.strokeStyle = weapons.color;
			ctx.lineWidth = 0.2 * radius;

			ctx.beginPath();
			ctx.translate(origin.x, origin.y);
			ctx.rotate(-Math.PI / 2);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= weapons.laser.nbSides + 1; i++) {
				ctx.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
			}
			ctx.rotate(Math.PI / 2);
			ctx.stroke();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	superZone: {
		draw: (ctx, origin, radius) => {
			ctx.strokeStyle = weapons.color;
			ctx.lineWidth = 0.2 * radius;

			ctx.beginPath();
			ctx.translate(origin.x, origin.y);
			ctx.arc(0, 0, radius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
};

export const bulletsList = {
	gun_bullet: {
		draw: (ctx, origin, radius, color) => {
			const angle = (2 * Math.PI) / weapons.gun.nbSides;
			ctx.fillStyle = color;
			ctx.lineWidth = 0.1 * radius;

			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= weapons.gun.nbSides; i++) {
				ctx.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
			}
			ctx.fill();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	bigGun_bullet: {
		draw: (ctx, origin, radius, color) => {
			const angle = (2 * Math.PI) / weapons.bigGun.nbSides;
			ctx.fillStyle = color;
			ctx.lineWidth = 0.1 * radius;

			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= weapons.bigGun.nbSides; i++) {
				ctx.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
			}
			ctx.fill();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	zone_bullet: {
		draw: (ctx, origin, radius, color) => {
			ctx.strokeStyle = color;
			ctx.lineWidth = 0.04 * radius;

			ctx.beginPath();

			ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	laser_bullet: {
		draw: (ctx, origin, radius, color) => {
			const angle = (2 * Math.PI) / weapons.laser.nbSides;
			ctx.fillStyle = color;
			ctx.lineWidth = 0.1 * radius;

			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.moveTo(radius, 0);
			for (let i = 1; i <= weapons.laser.nbSides; i++) {
				ctx.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
			}
			ctx.fill();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
	superZone_bullet: {
		draw: (ctx, origin, radius, color) => {
			ctx.strokeStyle = color;
			ctx.lineWidth = 0.04 * radius;

			ctx.beginPath();

			ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.resetTransform();
			ctx.closePath();
		},
	},
};

export const monsters = {
	color: 'orangered',
	monster: {
		draw: (ctx, origin, radius, maxHP, HP) => {
			ctx.fillStyle = monsters.color;
			ctx.beginPath();

			ctx.translate(origin.x, origin.y);
			ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
			const hpDisplayWidth = radius * 2 * 1.5 * (HP / maxHP);
			if (hpDisplayWidth <= 0) return;
			ctx.fillRect(
				-radius * 1.5,
				radius * 1.5,
				hpDisplayWidth,
				radius * 2 * 0.15
			);
			ctx.resetTransform();
			ctx.closePath();
		},
	},
};
