import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MonsterEntity } from './MonsterEntity.js';
import { PlayerEntity } from './PlayerEntity.js';
import { difficulties } from '../Difficulty.js';

// à finir quand le côté serveur sera opérationnel

describe('Monster entity tests', () => {
	it('go toward player', () => {
		const PDatas = {
			pos: { x: 0, y: 0 },
			radius: 1 / 2,
		};
		const MDatas = {
			pos: { x: 2, y: 2 },
			radius: 1 / 2,
			difficulty: difficulties.normal.monster,
		};
		const pt = new PlayerEntity(PDatas);
		const me = new MonsterEntity(MDatas, pt);
		me.update();
		assert.strictEqual(me.pos.x, 2 - Math.sqrt(2) / 2);
		assert.strictEqual(me.pos.y, 2 - Math.sqrt(2) / 2);
	});
});
