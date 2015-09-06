/*
 * Copyright (c) 2011.
 *
 * Author: oldj <oldj.wu@gmail.com>
 * Blog: http://oldj.net/
 *
 * 本文件定义了怪物默认属性及渲染方法
 */


// _TD.a.push begin
_TD.a.push(function (TD) {

	/**
	 * 默认的怪物渲染方法
	 */
	function defaultMonsterRender() {
		if (!this.is_valid || !this.grid) return;
		var ctx = TD.ctx;

		// 画一个圆代表怪物
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// 画怪物的生命值
		if (TD.show_monster_life) {
			var s = Math.floor(TD.grid_size / 4),
				l = s * 2 - 2 * _TD.retina;
			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.fillRect(this.cx - s, this.cy - this.r - 6, s * 2, 4 * _TD.retina);
			ctx.closePath();
			ctx.fillStyle = "#f00";
			ctx.beginPath();
			ctx.fillRect(this.cx - s + _TD.retina, this.cy - this.r - (6 - _TD.retina), this.life * l / this.life0, 2 * _TD.retina);
			ctx.closePath();
		}
	}

	/**
	 * 取得怪物的默认属性
	 * @param [monster_idx] {Number} 怪物的类型
	 * @return attributes {Object}
	 */
	TD.getDefaultMonsterAttributes = function (monster_idx) {

		var monster_attributes = [
			{
				// idx: 0
				name: "monster 1",
				desc: "最弱小的怪物",
				speed: 3,
				max_speed: 10,
				life: 50,
				damage: 1, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 0,
				money: 5 // 消灭本怪物后可得多少金钱（可选）
			},
			{
				// idx: 1
				name: "monster 2",
				desc: "稍强一些的小怪",
				speed: 6,
				max_speed: 20,
				life: 50,
				damage: 2, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 1
			},
			{
				// idx: 2
				name: "monster speed",
				desc: "速度较快的小怪",
				speed: 12,
				max_speed: 30,
				life: 50,
				damage: 3, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 1
			},
			{
				// idx: 3
				name: "monster life",
				desc: "生命值很强的小怪",
				speed: 5,
				max_speed: 10,
				life: 500,
				damage: 3, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 1
			},
			{
				// idx: 4
				name: "monster shield",
				desc: "防御很强的小怪",
				speed: 5,
				max_speed: 10,
				life: 50,
				damage: 3, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 20
			},
			{
				// idx: 5
				name: "monster damage",
				desc: "伤害值很大的小怪",
				speed: 7,
				max_speed: 14,
				life: 50,
				damage: 10, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 2
			},
			{
				// idx: 6
				name: "monster speed-life",
				desc: "速度、生命都较高的怪物",
				speed: 15,
				max_speed: 30,
				life: 100,
				damage: 3, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 3
			},
			{
				// idx: 7
				name: "monster speed-2",
				desc: "速度很快的怪物",
				speed: 30,
				max_speed: 40,
				life: 30,
				damage: 4, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 1
			},
			{
				// idx: 8
				name: "monster shield-life",
				desc: "防御很强、生命值很高的怪物",
				speed: 3,
				max_speed: 10,
				life: 300,
				damage: 5, // 到达终点后会带来多少点伤害（1 ~ 10）
				shield: 15
			}
		];

		if (typeof monster_idx == "undefined") {
			// 如果只传了一个参数，则只返回共定义了多少种怪物（供 td.js 中使用）
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
		var a = [], count = 0, i, c, d, r, l = TD.monster_type_count;
		if (!range) {
			range = [];
			for (i = 0; i < l; i++) {
				range.push(i);
			}
		}

		while (count < n) {
			d = n - count;
			c = Math.min(
				Math.floor(Math.random() * d) + 1,
				3 // 同一类型的怪物一次最多出现 3 个，防止某一波中怪出大量高防御或高速度的怪
			);
			r = Math.floor(Math.random() * l);
			a.push([c, range[r]]);
			count += c;
		}

		return a;
	};


}); // _TD.a.push end
