/**
 *
 * Author:
 *	oldj <oldj.wu@gmail.com>
 *	http://oldj.net/
 *
 * File: td-obj-monster.js
 *
 * Create Date: 2010-11-20 12:34:41
 *
 */


// _TD.a.push begin
_TD.a.push(function (TD) {

	// monster 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var monster_obj = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.idx = cfg.idx || 1;
			this.difficulty = cfg.difficulty || 1.0;
			var attr = TD.getDefaultMonsterAttributes(this.idx);

			this.speed = Math.floor(
				(attr.speed + this.difficulty - 1) * (Math.random() * 0.5 + 0.75));
			if (this.speed < 1) this.speed = 1;
			if (this.speed > cfg.max_speed) this.speed = cfg.max_speed;

			this.life = this.life0 = Math.floor(
				attr.life * this.difficulty * (Math.random() + 0.5));
			if (this.life < 1) this.life = this.life0 = 1;

			this.shield = Math.floor(attr.shield + Math.sqrt(this.difficulty) - 1);
			if (this.shield < 0) this.shield = 0;

			this.damage = Math.floor((attr.damage || 1) * (0.5 + Math.random()));
			if (this.damage < 1) this.damage = 1;

			this.money = attr.money || Math.floor(
				Math.sqrt((this.speed + this.life) * (this.shield + 1) * this.damage));
			if (this.money < 1) this.money = 1;

			this.color = attr.color || TD.lang.rndRGB();
			this.r = this.damage;
			if (this.r < 4) this.r = 4;
			if (this.r > TD.grid_size / 2 - 4) this.r = TD.grid_size / 2 - 4;
			this.render = attr.render;

			this.grid = null; // 当前格子
			this.map = null;
			this.next_grid = null;
			this.way = [];
			this.toward = 2; // 默认面朝下方
			this._dx = 0;
			this._dy = 0;

			this.is_blocked = false; // 前进的道路是否被阻塞了
		},
		caculatePos: function () {
//		if (!this.map) return;
		},
		beHit: function (building, damage) {
			if (!this.is_valid) return;
			damage -= this.shield;
			if (damage <= 0) damage = 1;
			this.life -= damage;
			TD.score += Math.min(
				Math.floor(Math.sqrt(damage)), 1
				);
			if (this.life < 0) {
				this.beKilled(building);
			}
		},
		beKilled: function (building) {
			if (!this.is_valid) return;
			this.life = 0;
			this.is_valid = false;

			TD.money += this.money;
			building.killed ++;
		},
		arrive: function () {
			this.grid = this.next_grid;
			this.next_grid = null;
			this.checkFinish();
		},
		findWay: function () {
			var _this = this;
			var fw = new TD.FindWay(
				this.map.grid_x, this.map.grid_y,
				this.grid.mx, this.grid.my,
				this.map.exit.mx, this.map.exit.my,
				function (x, y) {
					return _this.map.checkPassable(x, y);
				}
				);
			this.way = fw.way;
			delete fw;
		},

		/**
		 * 检查是否已到达终点
		 */
		checkFinish: function () {
			if (this.grid && this.map && this.grid == this.map.exit) {
				TD.life -= this.damage;
				TD.wave_damage += this.damage;
				if (TD.life <= 0) {
					TD.life = 0;
					TD.stage.gameover();
				} else {
					this.pause();
					this.del();
				}
			}
		},
		beAddToGrid: function (grid) {
			this.grid = grid;
			this.map = grid.map;
			this.cx = grid.cx;
			this.cy = grid.cy;

			this.grid.scene.addElement(this);
		},

		/**
		 * 取得朝向
		 * 即下一个格子在当前格子的哪边
		 *	 0：上；1：右；2：下；3：左
		 */
		getToward: function () {
			if (!this.grid || !this.next_grid) return;
			if (this.grid.my < this.next_grid.my) {
				this.toward = 0;
			} else if (this.grid.mx < this.next_grid.mx) {
				this.toward = 1;
			} else if (this.grid.my > this.next_grid.my) {
				this.toward = 2;
			} else if (this.grid.mx > this.next_grid.mx) {
				this.toward = 3;
			}
		},

		/**
		 * 取得要去的下一个格子
		 */
		getNextGrid: function () {
			if (this.way.length == 0 ||
				Math.random() < 0.1 // 有 1/10 的概率自动重新寻路
				) {
				this.findWay();
			}

			var next_grid = this.way.shift();
			if (next_grid && !this.map.checkPassable(next_grid[0], next_grid[1])) {
				this.findWay();
				next_grid = this.way.shift();
			}

			if (!next_grid) {
				return;
			}

			this.next_grid = this.map.getGrid(next_grid[0], next_grid[1]);
//			this.getToward(); // 在这个版本中暂时没有用
		},

		/**
		 * 怪物前进的道路被阻塞（被建筑包围了）
		 */
		beBlocked: function () {
			if (this.is_blocked) return;

			this.is_blocked = true;
			TD.log("monster be blocked!");
		},

		step: function () {
			if (!this.is_valid || this.is_paused || !this.grid) return;

			if (!this.next_grid) {
				this.getNextGrid();

				/**
				 * 如果依旧找不着下一步可去的格子，说明当前怪物被阻塞了
				 */
				if (!this.next_grid) {
					this.beBlocked();
					return;
				}
			}

			if (this.cx == this.next_grid.cx && this.cy == this.next_grid.cy) {
				this.arrive();
			} else {
				// 移动到 next grid

				var dpx = this.next_grid.cx - this.cx,
					dpy = this.next_grid.cy - this.cy,
					sx = dpx < 0 ? -1 : 1,
					sy = dpy < 0 ? -1 : 1,
					speed = this.speed * TD.global_speed;

				if (Math.abs(dpx) < speed && Math.abs(dpy) < speed) {
					this.cx = this.next_grid.cx;
					this.cy = this.next_grid.cy;
					this._dx = speed - Math.abs(dpx);
					this._dy = speed - Math.abs(dpy);
				} else {
					this.cx += dpx == 0 ? 0 : sx * (speed + this._dx);
					this.cy += dpy == 0 ? 0 : sy * (speed + this._dy);
					this._dx = 0;
					this._dy = 0;
				}
			}
		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 life: 怪物的生命值
	 *			 shield: 怪物的防御值
	 *			 speed: 怪物的速度
	 *		 }
	 */
	TD.Monster = function (id, cfg) {
		//cfg.on_events = ["enter", "out", "click"];
		//monster 暂时不监听事件
		var monster = new TD.Element(id, cfg);
		TD.lang.mix(monster, monster_obj);
		monster._init(cfg);

		return monster;
	}

}); // _TD.a.push end


