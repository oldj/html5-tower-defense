/**
 *
 * Author:
 *	oldj <oldj.wu@gmail.com>
 *	http://oldj.net/
 *
 * File: td-data-stage-1.js
 *
 * Create Date: 2010-11-18 16:01:22
 *
 * 默认关卡
 */

// _TD.a.push begin
_TD.a.push(function (TD) {

// main stage 初始化方法
	var _stage_main_init = function () {
		var act = new TD.Act(this, "act-1"),
			scene = new TD.Scene(act, "scene-1"),
			cfg = TD.getDefaultStageData("scene_endless");

		this.config = cfg.config;
		TD.life = this.config.life;
		TD.money = this.config.money;
		TD.score = this.config.score;
		TD.difficulty = this.config.difficulty;
		TD.wave_damage = this.config.wave_damage;

		// make map
		var map = new TD.Map("main-map", TD.lang.mix({
			scene: scene,
			is_main_map: true,
			step_level: 1,
			render_level: 2
		}, cfg.map));
		map.addToScene(scene, 1, 2, map.grids);
		scene.map = map;

		// make panel
		scene.panel = new TD.Panel("panel", TD.lang.mix({
			scene: scene,
			main_map: map,
			step_level: 1,
			render_level: 7
		}, cfg.panel));

		this.newWave = cfg.newWave;
		this.map = map;
		this.wait_new_wave = this.config.wait_new_wave;
	},
		_stage_main_step2 = function () {
			//TD.log(this.current_act.current_scene.wave);

			var scene = this.current_act.current_scene,
				wave = scene.wave;
			if ((wave == 0 && !this.map.has_weapon) || scene.state != 1) {
				return;
			}

			if (this.map.monsters.length == 0) {

				if (this.wait_new_wave > 0) {
					this.wait_new_wave --;
					return;
				}

				this.wait_new_wave = this.config.wait_new_wave;
				wave ++;
				scene.wave = wave;
				this.newWave({
					map: this.map,
					wave: wave
				});
			}
		};

	TD.getDefaultStageData = function (k) {
		var data = {
			stage_main: {
				width: 640, // px
				height: 560,
				init: _stage_main_init,
				step2: _stage_main_step2
			},

			scene_endless: {
				// scene 1
				map: {
					grid_x: 16,
					grid_y: 16,
					x: TD.padding,
					y: TD.padding,
					entrance: [0, 0],
					exit: [15, 15],
					grids_cfg: [
						{
							pos: [3, 3],
							//building: "cannon",
							passable_flag: 0
						},
						{
							pos: [7, 15],
							build_flag: 0
						},
						{
							pos: [4, 12],
							building: "wall"
						},
						{
							pos: [4, 13],
							building: "wall"
							//}, {
							//pos: [11, 9],
							//building: "cannon"
							//}, {
							//pos: [5, 2],
							//building: "HMG"
							//}, {
							//pos: [14, 9],
							//building: "LMG"
							//}, {
							//pos: [3, 14],
							//building: "LMG"
						}
					]
				},
				panel: {
					x: TD.padding * 2 + TD.grid_size * 16,
					y: TD.padding,
					map: {
						grid_x: 3,
						grid_y: 3,
						x: 0,
						y: 110,
						grids_cfg: [
							{
								pos: [0, 0],
								building: "cannon"
							},
							{
								pos: [1, 0],
								building: "LMG"
							},
							{
								pos: [2, 0],
								building: "HMG"
							},
							{
								pos: [0, 1],
								building: "laser_gun"
							},
							{
								pos: [2, 2],
								building: "wall"
							}
						]
					}
				},
				config: {
					endless: true,
					wait_new_wave: 100, // 经过多少 step 后再开始新的一波
					difficulty: 1.0, // 难度系数
					wave: 0,
					max_wave: -1,
					wave_damage: 0, // 当前一波怪物造成了多少点生命值的伤害
					max_monsters_per_wave: 100, // 每一波最多多少怪物
					money: 500,
					score: 0, // 开局时的积分
					life: 100,
					waves: [ // 这儿只定义了前 10 波怪物，从第 11 波开始自动生成
						[],
						// 第一个参数是没有用的（第 0 波）

						// 第一波
						[
							[1, 0] // 1 个 0 类怪物
						],

						// 第二波
						[
							[1, 0], // 1 个 0 类怪物
							[1, 1] // 1 个 1 类怪物
						],

						// wave 3
						[
							[2, 0], // 2 个 0 类怪物
							[1, 1] // 1 个 1 类怪物
						],

						// wave 4
						[
							[2, 0],
							[1, 1]
						],

						// wave 5
						[
							[3, 0],
							[2, 1]
						],

						// wave 6
						[
							[4, 0],
							[2, 1]
						],

						// wave 7
						[
							[5, 0],
							[3, 1],
							[1, 2]
						],

						// wave 8
						[
							[6, 0],
							[4, 1],
							[1, 2]
						],

						// wave 9
						[
							[7, 0],
							[3, 1],
							[2, 2]
						],

						// wave 10
						[
							[8, 0],
							[4, 1],
							[3, 2]
						]
					]
				},

				/**
				 * 生成第 n 波怪物的方法
				 */
				newWave: function (cfg) {
					cfg = cfg || {};
					var map = cfg.map,
						wave = cfg.wave || 1,
						//difficulty = TD.difficulty || 1.0,
						wave_damage = TD.wave_damage || 0;

					// 自动调整难度系数
					if (wave == 1) {
						//pass
					} else if (wave_damage == 0) {
						// 没有造成伤害
						if (wave < 5) {
							TD.difficulty *= 1.05;
						} else if (TD.difficulty > 20) {
							TD.difficulty *= 1.05;
						} else if (TD.difficulty > 10) {
							TD.difficulty *= 1.1;
						} else {
							TD.difficulty *= 1.2;
						}
					} else if (TD.wave_damage >= 50) {
						TD.difficulty *= 0.7;
					} else if (TD.wave_damage >= 20) {
						TD.difficulty *= 0.8;
					} else if (TD.wave_damage >= 10) {
						TD.difficulty *= 0.9;
					} else {
						// 造成了 10 点以内的伤害
						if (wave >= 10)
							TD.difficulty *= 1.05;
					}

					TD.log("wave " + wave + ", last wave damage = " + wave_damage + ", difficulty = " + TD.difficulty);

					//map.addMonsters(100, 7);
					//map.addMonsters2([[10, 7], [5, 0], [5, 5]]);
					//
					var wave_data = this.config.waves[wave] ||
						// 自动生成怪物
						TD.makeMonsters(Math.min(
							Math.floor(Math.pow(wave, 1.1)),
							this.config.max_monsters_per_wave
						));
					map.addMonsters2(wave_data);

					TD.wave_damage = 0;
				}
			} // end of scene_endless
		};

		return data[k] || {};
	};

}); // _TD.a.push end


