/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-obj-map2.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-18 18:28:34
* Last Update: 2010-11-23 11:10:14
*
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
			grid_data = cfg.grid_data || [],
			d, grid;

		for (i = 0; i < l; i ++) {
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
			TD.lang.each(cfg.grids_cfg, function () {
				var grid = _this.getGrid(this.pos[0], this.pos[1]);
				if (!grid) return;
				if (!isNaN(this.passable_flag))
					grid.passable_flag = this.passable_flag;
				if (!isNaN(this.build_flag))
					grid.build_flag = this.build_flag;
				if (this.building) {
					grid.addBuilding(this.building);
				}
			});
		}
	},
	checkHasWeapon: function () {
		this.has_weapon = (this.anyBuilding(function () {
			return this.is_weapon;
		}) != null);
	},
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
	cancelPreBuild: function () {
		TD.mode = "normal";
		if (this.pre_building) {
			this.pre_building.remove();
		}
		//this.show_all_ranges = false;
	},
	clearInvalidElements: function () {
		if (this._wait_clearInvalidElements > 0) {
			this._wait_clearInvalidElements --;
			return;
		}
		this._wait_clearInvalidElements = _default_wait_clearInvalidElements;

		var a = [];
		TD.lang.shift(this.buildings, function () {
			if (this.is_valid)
				a.push(this);
		});
		this.buildings = a;

		a = [];
		TD.lang.shift(this.monsters, function () {
			if (this.is_valid)
				a.push(this);
		});
		this.monsters = a;

		a = [];
		TD.lang.shift(this.bullets, function () {
			if (this.is_valid)
				a.push(this);
		});
		this.bullets = a;
	},
	/**
	 * 在地图的入口处添加一个怪物
	 * @param monster 可以是数字，也可以是 monster 对象
	 */
	addMonster: function (monster) {
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
	addMonsters: function (n, monster) {
		this._wait_add_monsters = n;
		this._wait_add_monsters_objidx = monster;
	},
	/**
	 * arr 的格式形如：
	 * 	[[1, 0], [2, 5], [3, 6], [10, 4]...]
	 */
	addMonsters2: function (arr) {
		this._wait_add_monsters_arr = arr;
	},
	checkPassable: function (mx, my) {
		var grid = this.getGrid(mx, my);
		return (grid != null && grid.passable_flag == 1 && grid.build_flag != 2);
	},
	step: function () {
		this.clearInvalidElements();

		if (this._wait_add_monsters > 0) {
			this.addMonster(this._wait_add_monsters_objidx);
			this._wait_add_monsters --;
		} else if (this._wait_add_monsters_arr.length > 0) {
			var a = this._wait_add_monsters_arr.shift();
			this.addMonsters(a[0], a[1]);
		}
	},
	render: function () {
		var ctx = TD.ctx;
		ctx.strokeStyle = "#666";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width, this.height);
		ctx.closePath();
		ctx.stroke();
	},
	onOut: function () {
		if (this.is_main_map && this.pre_building)
			this.pre_building.hide();
	}
};

/**
 * @param cfg <object> 配置对象
 * 		至少需要包含以下项：
 * 		{
 * 			grid_x: 宽度（格子）,
 * 			grid_y: 高度（格子）,
 * 			scene: 属于哪个场景,
 * 		}
 */
TD.Map = function (id, cfg) {
	// map 目前只监听 enter、out 事件
	cfg.on_events = ["enter", "out"];
	var map = new TD.Element(id, cfg);
	TD.lang.mix(map, map_obj);
	map._init(cfg);

	return map;
};


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
	step: function () {
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
 * @param cfg <object> 至少需要包含
 * 		{
 * 			map: map 对象
 * 		}
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
function MainMapMask (id, cfg) {
	var mmm = new TD.Element(id, cfg);
	TD.lang.mix(mmm, mmm_obj);
	mmm._init(cfg);

	return mmm;
}

}); // _TD.a.push end

