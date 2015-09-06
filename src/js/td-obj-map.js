/*
 * Copyright (c) 2011.
 *
 * Author: oldj <oldj.wu@gmail.com>
 * Blog: http://oldj.net/
 *
 * Last Update: 2011/1/10 5:22:52
 */


// _TD.a.push begin
_TD.a.push(function (TD) {

	var _default_wait_clearInvalidElements = 20;

	// map 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var map_obj = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.grid_x = cfg.grid_x || 10;
			this.grid_y = cfg.grid_y || 10;
			this.x = cfg.x || 0;
			this.y = cfg.y || 0;
			this.width = this.grid_x * TD.grid_size;
			this.height = this.grid_y * TD.grid_size;
			this.x2 = this.x + this.width;
			this.y2 = this.y + this.width;
			this.grids = [];
			this.entrance = this.exit = null;
			this.buildings = [];
			this.monsters = [];
			this.bullets = [];
			this.scene = cfg.scene;
			this.is_main_map = !!cfg.is_main_map;
			this.select_hl = TD.MapSelectHighLight(this.id + "-hl", {
				map: this
			});
			this.select_hl.addToScene(this.scene, 1, 9);
			this.selected_building = null;
			this._wait_clearInvalidElements = _default_wait_clearInvalidElements;
			this._wait_add_monsters = 0;
			this._wait_add_monsters_arr = [];
			if (this.is_main_map) {
				this.mmm = new MainMapMask(this.id + "-mmm", {
					map: this
				});
				this.mmm.addToScene(this.scene, 1, 7);

			}

			// 下面添加相应的格子
			var i, l = this.grid_x * this.grid_y,
				grid_data = cfg["grid_data"] || [],
				d, grid;

			for (i = 0; i < l; i++) {
				d = grid_data[i] || {};
				d.mx = i % this.grid_x;
				d.my = Math.floor(i / this.grid_x);
				d.map = this;
				d.step_level = this.step_level;
				d.render_level = this.render_level;
				grid = new TD.Grid(this.id + "-grid-" + d.mx + "-" + d.my, d);
				this.grids.push(grid);
			}

			if (cfg.entrance && cfg.exit && !TD.lang.arrayEqual(cfg.entrance, cfg.exit)) {
				this.entrance = this.getGrid(cfg.entrance[0], cfg.entrance[1]);
				this.entrance.is_entrance = true;
				this.exit = this.getGrid(cfg.exit[0], cfg.exit[1]);
				this.exit.is_exit = true;
			}

			var _this = this;
			if (cfg.grids_cfg) {
				TD.lang.each(cfg.grids_cfg, function (obj) {
					var grid = _this.getGrid(obj.pos[0], obj.pos[1]);
					if (!grid) return;
					if (!isNaN(obj.passable_flag))
						grid.passable_flag = obj.passable_flag;
					if (!isNaN(obj.build_flag))
						grid.build_flag = obj.build_flag;
					if (obj.building) {
						grid.addBuilding(obj.building);
					}
				});
			}
		},

		/**
		 * 检查地图中是否有武器（具备攻击性的建筑）
		 * 因为第一波怪物只有在地图上有了第一件武器后才会出现
		 */
		checkHasWeapon: function () {
			this.has_weapon = (this.anyBuilding(function (obj) {
				return obj.is_weapon;
			}) != null);
		},

		/**
		 * 取得指定位置的格子对象
		 * @param mx {Number} 地图上的坐标 x
		 * @param my {Number} 地图上的坐标 y
		 */
		getGrid: function (mx, my) {
			var p = my * this.grid_x + mx;
			return this.grids[p];
		},

		anyMonster: function (f) {
			return TD.lang.any(this.monsters, f);
		},
		anyBuilding: function (f) {
			return TD.lang.any(this.buildings, f);
		},
		anyBullet: function (f) {
			return TD.lang.any(this.bullets, f);
		},
		eachBuilding: function (f) {
			TD.lang.each(this.buildings, f);
		},
		eachMonster: function (f) {
			TD.lang.each(this.monsters, f);
		},
		eachBullet: function (f) {
			TD.lang.each(this.bullets, f);
		},

		/**
		 * 预建设
		 * @param building_type {String}
		 */
		preBuild: function (building_type) {
			TD.mode = "build";
			if (this.pre_building) {
				this.pre_building.remove();
			}

			this.pre_building = new TD.Building(this.id + "-" + "pre-building-" + TD.lang.rndStr(), {
				type: building_type,
				map: this,
				is_pre_building: true
			});
			this.scene.addElement(this.pre_building, 1, this.render_level + 1);
			//this.show_all_ranges = true;
		},

		/**
		 * 退出预建设状态
		 */
		cancelPreBuild: function () {
			TD.mode = "normal";
			if (this.pre_building) {
				this.pre_building.remove();
			}
			//this.show_all_ranges = false;
		},

		/**
		 * 清除地图上无效的元素
		 */
		clearInvalidElements: function () {
			if (this._wait_clearInvalidElements > 0) {
				this._wait_clearInvalidElements--;
				return;
			}
			this._wait_clearInvalidElements = _default_wait_clearInvalidElements;

			var a = [];
			TD.lang.shift(this.buildings, function (obj) {
				if (obj.is_valid)
					a.push(obj);
			});
			this.buildings = a;

			a = [];
			TD.lang.shift(this.monsters, function (obj) {
				if (obj.is_valid)
					a.push(obj);
			});
			this.monsters = a;

			a = [];
			TD.lang.shift(this.bullets, function (obj) {
				if (obj.is_valid)
					a.push(obj);
			});
			this.bullets = a;
		},

		/**
		 * 在地图的入口处添加一个怪物
		 * @param monster 可以是数字，也可以是 monster 对象
		 */
		addMonster: function (monster) {
			if (!this.entrance) return;
			if (typeof monster == "number") {
				monster = new TD.Monster(null, {
					idx: monster,
					difficulty: TD.difficulty,
					step_level: this.step_level,
					render_level: this.render_level + 2
				});
			}
			this.entrance.addMonster(monster);
		},

		/**
		 * 在地图的入口处添加 n 个怪物
		 * @param n
		 * @param monster
		 */
		addMonsters: function (n, monster) {
			this._wait_add_monsters = n;
			this._wait_add_monsters_objidx = monster;
		},

		/**
		 * arr 的格式形如：
		 *     [[1, 0], [2, 5], [3, 6], [10, 4]...]
		 */
		addMonsters2: function (arr) {
			this._wait_add_monsters_arr = arr;
		},

		/**
		 * 检查地图的指定格子是否可通过
		 * @param mx {Number}
		 * @param my {Number}
		 */
		checkPassable: function (mx, my) {
			var grid = this.getGrid(mx, my);
			return (grid != null && grid.passable_flag == 1 && grid.build_flag != 2);
		},

		step: function () {
			this.clearInvalidElements();

			if (this._wait_add_monsters > 0) {
				this.addMonster(this._wait_add_monsters_objidx);
				this._wait_add_monsters--;
			} else if (this._wait_add_monsters_arr.length > 0) {
				var a = this._wait_add_monsters_arr.shift();
				this.addMonsters(a[0], a[1]);
			}
		},

		render: function () {
			var ctx = TD.ctx;
			ctx.strokeStyle = "#99a";
			ctx.lineWidth = _TD.retina;
			ctx.beginPath();
			ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width, this.height);
			ctx.closePath();
			ctx.stroke();
		},

		/**
		 * 鼠标移出地图事件
		 */
		onOut: function () {
			if (this.is_main_map && this.pre_building)
				this.pre_building.hide();
		}
	};

	/**
	 * @param id {String} 配置对象
	 * @param cfg {Object} 配置对象
	 *         至少需要包含以下项：
	 *         {
	 *			 grid_x: 宽度（格子）,
	 *			 grid_y: 高度（格子）,
	 *			 scene: 属于哪个场景,
	 *		 }
	 */
	TD.Map = function (id, cfg) {
		// map 目前只需要监听 out 事件
		// 虽然只需要监听 out 事件，但同时也需要监听 enter ，因为如果
		// 没有 enter ，out 将永远不会被触发
		cfg.on_events = ["enter", "out"];
		var map = new TD.Element(id, cfg);
		TD.lang.mix(map, map_obj);
		map._init(cfg);

		return map;
	};


	/**
	 * 地图选中元素高亮边框对象
	 */
	var map_selecthl_obj = {
		_init: function (cfg) {
			this.map = cfg.map;
			this.width = TD.grid_size + 2;
			this.height = TD.grid_size + 2;
			this.is_visiable = false;
		},
		show: function (grid) {
			this.x = grid.x;
			this.y = grid.y;
			this.is_visiable = true;
		},
		render: function () {
			var ctx = TD.ctx;
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#f93";
			ctx.beginPath();
			ctx.strokeRect(this.x, this.y, this.width - 1, this.height - 1);
			ctx.closePath();
			ctx.stroke();
		}
	};

	/**
	 * 地图选中的高亮框
	 * @param id {String} 至少需要包含
	 * @param cfg {Object} 至少需要包含
	 *      {
	 *          map: map 对象
	 *      }
	 */
	TD.MapSelectHighLight = function (id, cfg) {
		var map_selecthl = new TD.Element(id, cfg);
		TD.lang.mix(map_selecthl, map_selecthl_obj);
		map_selecthl._init(cfg);

		return map_selecthl;
	};


	var mmm_obj = {
		_init: function (cfg) {
			this.map = cfg.map;

			this.x1 = this.map.x;
			this.y1 = this.map.y;
			this.x2 = this.map.x2 + 1;
			this.y2 = this.map.y2 + 1;
			this.w = this.map.scene.stage.width;
			this.h = this.map.scene.stage.height;
			this.w2 = this.w - this.x2;
			this.h2 = this.h - this.y2;
		},
		render: function () {
			var ctx = TD.ctx;
			/*ctx.clearRect(0, 0, this.x1, this.h);
			 ctx.clearRect(0, 0, this.w, this.y1);
			 ctx.clearRect(0, this.y2, this.w, this.h2);
			 ctx.clearRect(this.x2, 0, this.w2, this.h2);*/

			ctx.fillStyle = "#fff";
			ctx.beginPath();
			ctx.fillRect(0, 0, this.x1, this.h);
			ctx.fillRect(0, 0, this.w, this.y1);
			ctx.fillRect(0, this.y2, this.w, this.h2);
			ctx.fillRect(this.x2, 0, this.w2, this.h);
			ctx.closePath();
			ctx.fill();

		}
	};

	/**
	 * 主地图外边的遮罩，用于遮住超出地图的射程等
	 */
	function MainMapMask(id, cfg) {
		var mmm = new TD.Element(id, cfg);
		TD.lang.mix(mmm, mmm_obj);
		mmm._init(cfg);

		return mmm;
	}

}); // _TD.a.push end

