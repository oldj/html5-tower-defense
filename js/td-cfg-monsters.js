/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-cfg-monsters.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-21 09:51:35
* Last Update: 2010-11-23 22:05:24
*
*/


// _TD.a.push begin
_TD.a.push(function (TD) {

/**
 * 默认的怪物渲染方法
 */
function defaultMonsterRender(monster) {
	if (!this.is_valid || !this.grid) return;
	var ctx = TD.ctx;

	ctx.drawImage(TD.res["monster-default"].img,
		24 * TD.iframe_rm2m4, 24 * this.toward, 24, 24, this.x, this.y, 24, 24
	);

	// render life
	renderMonsterLife(this);
}

function renderMonsterLife(monster) {
	if (TD.show_monster_life) {
		var s = Math.floor(TD.grid_size / 4),
			l = s * 2 - 2,
			ctx = TD.ctx;
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.fillRect(monster.cx - s, monster.cy - monster.r - 6, s * 2, 4);
		ctx.closePath();
		ctx.fillStyle = "#f00";
		ctx.beginPath();
		ctx.fillRect(monster.cx - s + 1, monster.cy - monster.r - 5, monster.life * l / monster.life0, 2);
		ctx.closePath();
	}
}

TD.getDefaultMonsterAttributes = function (monster_idx) {

	var monster_attributes = [{
		// idx: 0
		name: "monster 1",
		desc: "最弱小的怪物",
		speed: 3,
		max_speed: 10,
		life: 50,
		damage: 1, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 0,
		money: 5, // 消灭本怪物后可得多少金钱（可选）
		r: 8,
		render: function () {
			var ctx = TD.ctx;
			ctx.drawImage(TD.res["monster-0"].img,
				16 * TD.iframe_rm2m4, 16 * this.toward, 16, 16, this.x + 4, this.y, 16, 16
			);

			renderMonsterLife(this);
		}
	}, {
		// idx: 1
		name: "monster 2",
		desc: "稍强一些的小怪",
		speed: 6,
		max_speed: 20,
		life: 50,
		damage: 5, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 1
	}, {
		// idx: 2
		name: "monster speed",
		desc: "速度较快的小怪",
		speed: 12,
		max_speed: 30,
		life: 50,
		damage: 6, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 1
	}, {
		// idx: 3
		name: "monster life",
		desc: "生命值很强的小怪",
		speed: 5,
		max_speed: 10,
		life: 500,
		damage: 7, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 1
	}, {
		// idx: 4
		name: "monster shield",
		desc: "防御很强的小怪",
		speed: 5,
		max_speed: 10,
		life: 50,
		damage: 7, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 100
	}, {
		// idx: 5
		name: "monster damage",
		desc: "伤害值很大的小怪",
		speed: 7,
		max_speed: 14,
		life: 50,
		damage: 15, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 2
	}, {
		// idx: 6
		name: "monster speed-life",
		desc: "速度、生命都较高的怪物",
		speed: 15,
		max_speed: 30,
		life: 250,
		damage: 5, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 3
	}, {
		// idx: 7
		name: "monster speed-2",
		desc: "速度很快的怪物",
		speed: 30,
		max_speed: 40,
		life: 50,
		damage: 5, // 到达终点后会带来多少点伤害（1 ~ 15）
		shield: 1
	}];

	if (isNaN(monster_idx)) {
		return monster_attributes.length;
	}

	var attr = monster_attributes[monster_idx] || monster_attributes[0],
		attr2 = {};

	TD.lang.mix(attr2, attr);
	if (!attr2.render) {
		// 如果没有指定当前怪物的渲染方法
		attr2.render = defaultMonsterRender
	}

	return attr2;
};


/**
 * 生成一个怪物列表，
 * 包含 n 个怪物
 * 怪物类型在 range 中指定，如未指定，则为随机
 */
TD.makeMonsters = function (n, range) {
	var a = [], count = 0, i, c, d, r, l;
	if (!range) {
		range = [];
		for (i = 0; i < TD.monster_type_count; i ++) {
			range.push(i);
		}
	}
	l = range.length;

	while (count < n) {
		d = n - count;
		c = Math.floor(Math.random() * d) + 1;
		r = Math.floor(Math.random() * l);
		a.push([c, range[r]]);
		count += c;
	}

	return a;
}


}); // _TD.a.push end
