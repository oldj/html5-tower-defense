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

	// grid 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var grid_obj = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.map = cfg.map;
			this.scene = this.map.scene;
			this.mx = cfg.mx; // 在 map 中的格子坐标
			this.my = cfg.my;
			this.width = TD.grid_size;
			this.height = TD.grid_size;
			this.is_entrance = this.is_exit = false;
			this.passable_flag = 1; // 0: 不可通过; 1: 可通过
			this.build_flag = 1,// 0: 不可修建; 1: 可修建; 2: 已修建
			this.building = null;
			this.caculatePos();
		},

		/**
		 * 根据 map 位置及本 grid 的 (mx, my) ，计算格子的位置
		 */
		caculatePos: function () {
			this.x = this.map.x + this.mx * TD.grid_size;
			this.y = this.map.y + this.my * TD.grid_size;
			this.x2 = this.x + TD.grid_size;
			this.y2 = this.y + TD.grid_size;
			this.cx = Math.floor(this.x + TD.grid_size / 2);
			this.cy = Math.floor(this.y + TD.grid_size / 2);
		},

		/**
		 * 检查如果在当前格子建东西，是否会导致起点与终点被阻塞
		 */
		checkBlock: function () {
			if (this.is_entrance || this.is_exit) {
				this._block_msg = TD._t("entrance_or_exit_be_blocked");
				return true;
			}

			var is_blocked,
				_this = this,
				fw = new TD.FindWay(
					this.map.grid_x, this.map.grid_y,
					this.map.entrance.mx, this.map.entrance.my,
					this.map.exit.mx, this.map.exit.my,
					function (x, y) {
						return !(x == _this.mx && y == _this.my) && _this.map.checkPassable(x, y);
					}
				);

			is_blocked = fw.is_blocked;

			if (!is_blocked) {
				is_blocked = !!this.map.anyMonster(function (obj) {
					return obj.chkIfBlocked(_this.mx, _this.my);
				});
				if (is_blocked)
					this._block_msg = TD._t("monster_be_blocked");
			} else {
				this._block_msg = TD._t("blocked");
			}

			return is_blocked;
		},

		/**
		 * 购买建筑
		 * @param building_type {String}
		 */
		buyBuilding: function (building_type) {
			var cost = TD.getDefaultBuildingAttributes(building_type).cost || 0;
			if (TD.money >= cost) {
				TD.money -= cost;
				this.addBuilding(building_type);
			} else {
				TD.log(TD._t("not_enough_money", [cost]));
				this.scene.panel.balloontip.msg(TD._t("not_enough_money", [cost]), this);
			}
		},

		/**
		 * 在当前格子添加指定类型的建筑
		 * @param building_type {String}
		 */
		addBuilding: function (building_type) {
			if (this.building) {
				// 如果当前格子已经有建筑，先将其移除
				this.removeBuilding();
			}

			var building = new TD.Building("building-" + building_type + "-" + TD.lang.rndStr(), {
				type: building_type,
				step_level: this.step_level,
				render_level: this.render_level
			});
			building.locate(this);

			this.scene.addElement(building, this.step_level, this.render_level + 1);
			this.map.buildings.push(building);
			this.building = building;
			this.build_flag = 2;
			this.map.checkHasWeapon();
			if (this.map.pre_building)
				this.map.pre_building.hide();
		},

		/**
		 * 移除当前格子的建筑
		 */
		removeBuilding: function () {
			if (this.build_flag == 2)
				this.build_flag = 1;
			if (this.building)
				this.building.remove();
			this.building = null;
		},

		/**
		 * 在当前建筑添加一个怪物
		 * @param monster
		 */
		addMonster: function (monster) {
			monster.beAddToGrid(this);
			this.map.monsters.push(monster);
			monster.start();
		},

		/**
		 * 高亮当前格子
		 * @param show {Boolean}
		 */
		hightLight: function (show) {
			this.map.select_hl[show ? "show" : "hide"](this);
		},

		render: function () {
			var ctx = TD.ctx,
				px = this.x + 0.5,
				py = this.y + 0.5;

			//if (this.map.is_main_map) {
			//ctx.drawImage(this.map.res,
			//0, 0, 32, 32, this.x, this.y, 32, 32
			//);
			//}

			if (this.is_hover) {
				ctx.fillStyle = "rgba(255, 255, 200, 0.2)";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();
			}

			if (this.passable_flag == 0) {
				// 不可通过
				ctx.fillStyle = "#fcc";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();
			}

			/**
			 * 画入口及出口
			 */
			if (this.is_entrance || this.is_exit) {
				ctx.lineWidth = 1;
				ctx.fillStyle = "#ccc";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();

				ctx.strokeStyle = "#666";
				ctx.fillStyle = this.is_entrance ? "#fff" : "#666";
				ctx.beginPath();
				ctx.arc(this.cx, this.cy, TD.grid_size * 0.325, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}

			ctx.strokeStyle = "#eee";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.strokeRect(px, py, this.width, this.height);
			ctx.closePath();
			ctx.stroke();
		},

		/**
		 * 鼠标进入当前格子事件
		 */
		onEnter: function () {
			if (this.map.is_main_map && TD.mode == "build") {
				if (this.build_flag == 1) {
					this.map.pre_building.show();
					this.map.pre_building.locate(this);
				} else {
					this.map.pre_building.hide();
				}
			} else if (this.map.is_main_map) {
				var msg = "";
				if (this.is_entrance) {
					msg = TD._t("entrance");
				} else if (this.is_exit) {
					msg = TD._t("exit");
				} else if (this.passable_flag == 0) {
					msg = TD._t("_cant_pass");
				} else if (this.build_flag == 0) {
					msg = TD._t("_cant_build");
				}

				if (msg) {
					this.scene.panel.balloontip.msg(msg, this);
				}
			}
		},

		/**
		 * 鼠标移出当前格子事件
		 */
		onOut: function () {
			// 如果当前气球提示指向本格子，将其隐藏
			if (this.scene.panel.balloontip.el == this) {
				this.scene.panel.balloontip.hide();
			}
		},

		/**
		 * 鼠标点击了当前格子事件
		 */
		onClick: function () {
			if (this.scene.state != 1) return;

			if (TD.mode == "build" && this.map.is_main_map && !this.building) {
				// 如果处于建设模式下，并且点击在主地图的空格子上，则尝试建设指定建筑
				if (this.checkBlock()) {
					// 起点与终点之间被阻塞，不能修建
					this.scene.panel.balloontip.msg(this._block_msg, this);
				} else {
					// 购买建筑
					this.buyBuilding(this.map.pre_building.type);
				}
			} else if (!this.building && this.map.selected_building) {
				// 取消选中建筑
				this.map.selected_building.toggleSelected();
				this.map.selected_building = null;
			}
		}
	};

	/**
	 * @param id {String}
	 * @param cfg {object} 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 mx: 在 map 格子中的横向坐标,
	 *			 my: 在 map 格子中的纵向坐标,
	 *			 map: 属于哪个 map,
	 *		 }
	 */
	TD.Grid = function (id, cfg) {
		cfg.on_events = ["enter", "out", "click"];

		var grid = new TD.Element(id, cfg);
		TD.lang.mix(grid, grid_obj);
		grid._init(cfg);

		return grid;
	};

}); // _TD.a.push end
