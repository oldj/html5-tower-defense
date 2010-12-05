/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td.js
* @save-up: [../td.html]
*
* Create Date: 2010-11-11 15:46:23
* Last Update: 2010-12-03 16:09:09
*
* Version: 0.2.1.3288
*
*/

var _TD = {
	a: [],
	init: function (td_board, td_info) {
		delete this.init;

		var i,
			TD = {
			version: "0.2.1.3288",
			is_debug: true,
			is_paused: true,
			width: 16,
			height: 16,
			step_time: 35,
			show_monster_life: true,
			fps: 0,
			stage_data: {},
			defaultSettings: function () {
				return {
					grid_size: 32, // px
					padding: 10, // px
					global_speed: 0.1 // 全局速度系数
				};
			},
			init: function (ob_board, ob_info) {
				var _this = this;

				this.obj_board = TD.lang.$e(ob_board);
				this.canvas = this.obj_board.getElementsByTagName("canvas")[0];
				//this.obj_info = TD.lang.$e(ob_info);
				if (!this.canvas.getContext) return; // 不支持 canvas
				this.ctx = this.canvas.getContext("2d");
				this.canvas.onmousemove = function (e) {
					var xy = _this.getEventXY.call(_this, e);
					_this.hover(xy[0], xy[1]);
				};
				this.canvas.onclick = function (e) {
					var xy = _this.getEventXY.call(_this, e);
					_this.click(xy[0], xy[1]);
				};

				this.monster_type_count = TD.getDefaultMonsterAttributes(); // 一共有多少种怪物
				this.iframe = 0; // 当前播放到第几帧了
				this.last_iframe_time = (new Date()).getTime();
				this.fps = 0;

				var tryStart = function () {
					if (_this.res_to_load == 0) {
						_this.start();
					} else {
						_this.log("res to load: " + _this.res_to_load);
						setTimeout(tryStart, 100);
					}
				};
				tryStart();
			},
			start: function () {
				this.log("start!");
				clearTimeout(this._st);
				var _this = this, t;

				this.mode = "normal";
				this.eventManager.clear();

				this.lang.mix(this, this.defaultSettings());
				this.stage = new TD.Stage("stage-main", TD.getDefaultStageData("stage_main"));

				this.canvas.setAttribute("width", this.stage.width);
				this.canvas.setAttribute("height", this.stage.height);

				this.is_paused = false;
				this.stage.start();
				this.step();

				return this;
			},
			checkCheat: function (cheat_code) {
				// 作弊方法
				// javascript:_TD.cheat="money+";void(0);
				switch (cheat_code) {
					case "money+":
						this.money += 1000000;
						this.log("cheat success!");
						break;
					case "life+":
						this.life = 100;
						this.log("cheat success!");
						break;
					case "life-":
						this.life = 1;
						this.log("cheat success!");
						break;
					case "difficulty+":
						this.difficulty *= 2;
						this.log("cheat success! difficulty = " + this.difficulty);
						break;
					case "difficulty-":
						this.difficulty /= 2;
						this.log("cheat success! difficulty = " + this.difficulty);
						break;
				}
			},
			step: function () {
				if (this.is_debug && _TD && _TD.cheat) {
					this.checkCheat(_TD.cheat);
					_TD.cheat = "";
				}

				if (this.is_paused) return;

				this.iframe ++;
				this.iframe_rm2 = (this.iframe >> 2);
				this.iframe_rm2m4 = this.iframe_rm2 % 4;
				this.iframe_rm4 = (this.iframe >> 4);
				this.iframe_rm4m2 = this.iframe_rm4 % 2;
				this.iframe_rm4m4 = this.iframe_rm4 % 4;

				if (this.iframe % 48 == 0) {
					// 计算 fps
					t = (new Date()).getTime();
					this.fps = Math.round(480000 / (t - this.last_iframe_time)) / 10;
					this.last_iframe_time = t;

					// 动态调整 step_time ，保证 fps 为 24 左右
					if (this.fps < 23.6 && this.step_time > 10) {
						this.step_time --;
					} else if (this.fps > 24.4) {
						this.step_time ++;
					}
					if (this.iframe % 13 == 0)
						TD.log("FPS: " + this.fps + ", Step Time: " + this.step_time);
				}

				var _this = this;
				this.stage.step();
				this.stage.render();

				this._st = setTimeout(function () {
					_this.step();
				}, this.step_time);
			},
			getEventXY: function (e) {
				var wra = TD.lang.$e("wrapper"),
					x = e.clientX - wra.offsetLeft - this.canvas.offsetLeft + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
					y = e.clientY - wra.offsetTop - this.canvas.offsetTop + Math.max(document.documentElement.scrollTop, document.body.scrollTop);

				return [x, y];
			},
			hover: function (x, y) {
				this.eventManager.hover(x, y);
			},
			click: function (x, y) {
				this.eventManager.click(x, y);
			},
			mouseHand: function (v) {
				this.canvas.style.cursor = v ? "pointer" : "default";
			},
			log: function (txt) {
				if (this.is_debug && typeof console != "undefined" && console.log)
					console.log(txt);
			}
		};

		for (i = 0; this.a[i]; i ++) {
			this.a[i](TD);
		}
		delete this.a;

		TD.init(td_board, td_info);
	}
};
