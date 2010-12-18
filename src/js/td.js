/**
 *
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td.js
* Create Date: 2010-11-11 15:46:23
*
*
*/

var _TD = {
	a: [],
	init: function (td_board, is_debug) {
		delete this.init; // 一旦初始化运行，即删除这个入口引用，防止初始化方法被再次调用

		var i, TD = {
			version: "0.1.8.0",
			is_debug: !!is_debug,
			is_paused: true,
			width: 16, // 横向多少个格子
			height: 16, // 纵向多少个格子
			show_monster_life: true, // 是否显示怪物的生命值
			fps: 0,
			stage_data: {},
			defaultSettings: function () {
				return {
					step_time: 36, // 每一次 step 循环之间相隔多少毫秒
					grid_size: 32, // px
					padding: 10, // px
					global_speed: 0.1 // 全局速度系数
				};
			},
			/**
			 * 初始化
			 * @param ob_board
			 */
			init: function (ob_board/*, ob_info*/) {
				this.obj_board = TD.lang.$e(ob_board);
				this.canvas = this.obj_board.getElementsByTagName("canvas")[0];
				//this.obj_info = TD.lang.$e(ob_info);
				if (!this.canvas.getContext) return; // 不支持 canvas
				this.ctx = this.canvas.getContext("2d");
				this.monster_type_count = TD.getDefaultMonsterAttributes(); // 一共有多少种怪物
				this.iframe = 0; // 当前播放到第几帧了
				this.last_iframe_time = (new Date()).getTime();
				this.fps = 0;

				this.start();
			},
			/**
			 * 开始游戏，或重新开始游戏
			 */
			start: function () {
				clearTimeout(this._st);
				TD.log("Start!");
				var _this = this;

				this.mode = "normal"; // mode 分为 normail（普通模式）及 build（建造模式）两种
				this.eventManager.clear(); // 清除事件管理器中监听的事件
				this.lang.mix(this, this.defaultSettings());
				this.stage = new TD.Stage("stage-main", TD.getDefaultStageData("stage_main"));

				this.canvas.setAttribute("width", this.stage.width);
				this.canvas.setAttribute("height", this.stage.height);

				this.canvas.onmousemove = function (e) {
					var xy = _this.getEventXY.call(_this, e);
					_this.hover(xy[0], xy[1]);
				};
				this.canvas.onclick = function (e) {
					var xy = _this.getEventXY.call(_this, e);
					_this.click(xy[0], xy[1]);
				};

				this.is_paused = false;
				this.stage.start();
				this.step();

				return this;
			},
			/**
			 * 作弊方法
			 * @param cheat_code
			 *
			 * 用例：
			 * 1、增加 100 万金钱：javascript:_TD.cheat="money+";void(0);
			 * 2、难度增倍：javascript:_TD.cheat="difficulty+";void(0);
			 * 3、难度减半：javascript:_TD.cheat="difficulty-";void(0);
			 * 4、生命值恢复：javascript:_TD.cheat="life+";void(0);
			 * 5、生命值降为最低：javascript:_TD.cheat="life-";void(0);
			 */
			checkCheat: function (cheat_code) {
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
			/**
			 * 主循环方法
			 */
			step: function () {

				if (this.is_debug && _TD && _TD.cheat) {
					// 检查作弊代码
					this.checkCheat(_TD.cheat);
					_TD.cheat = "";
				}

				if (this.is_paused) return;

				this.iframe ++; // 当前总第多少帧
				if (this.iframe % 50 == 0) {
					// 计算 fps
					var t = (new Date()).getTime();
					this.fps = Math.round(500000 / (t - this.last_iframe_time)) / 10;
					this.last_iframe_time = t;

					// 动态调整 step_time ，保证 fps 恒定为 24 左右
					if (this.fps < 23.6 && this.step_time > 1) {
						this.step_time --;
					} else if (this.fps > 24.4) {
						this.step_time ++;
					}
					TD.log("FPS: " + this.fps + ", Step Time: " + this.step_time);
				}
				if (this.iframe % 2400 == 0) TD.gc(); // 每隔一段时间自动回收垃圾

				this.stage.step();
				this.stage.render();

				var _this = this;
				this._st = setTimeout(function () {
					_this.step();
				}, this.step_time);
			},
			/**
			 * 取得事件相对于 canvas 左上角的坐标
			 * @param e
			 */
			getEventXY: function (e) {
				var wra = TD.lang.$e("wrapper"),
					x = e.clientX - wra.offsetLeft - this.canvas.offsetLeft + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
					y = e.clientY - wra.offsetTop - this.canvas.offsetTop + Math.max(document.documentElement.scrollTop, document.body.scrollTop);

				return [x, y];
			},
			/**
			 * 鼠标移到指定位置事件
			 * @param x
			 * @param y
			 */
			hover: function (x, y) {
				this.eventManager.hover(x, y);
			},
			/**
			 * 点击事件
			 * @param x
			 * @param y
			 */
			click: function (x, y) {
				this.eventManager.click(x, y);
			},
			/**
			 * 是否将 canvas 中的鼠标指针变为手的形状
			 * @param v {Boolean}
			 */
			mouseHand: function (v) {
				this.canvas.style.cursor = v ? "pointer" : "default";
			},
			/**
			 * 显示调试信息，只在 is_debug 为 true 的情况下有效
			 * @param txt
			 */
			log: function (txt) {
				this.is_debug && window.console && console.log && console.log(txt);
			},
			/**
			 * 回收内存
			 * 注意：CollectGarbage 只在 IE 下有效
			 */
			gc: function () {
				if (window.CollectGarbage) {
					CollectGarbage();
					setTimeout(CollectGarbage, 1);
				}
			}
		};

		for (i = 0; this.a[i]; i ++) {
			// 依次执行添加到列表中的函数
			this.a[i](TD);
		}
		delete this.a;

		TD.init(td_board);
	}
};