/**
 *
 * Author:
 *	oldj <oldj.wu@gmail.com>
 *	http://oldj.net/
 *
 * File: td-stage.js
 *
 * Create Date: 2010-11-18 13:39:45
 *
 */


// _TD.a.push begin
_TD.a.push(function (TD) {

	/**
	 * 舞台类
	 * @param id {String} 舞台ID
	 * @param cfg {Object} 配置
	 */
	TD.Stage = function (id, cfg) {
		this.id = id || ("stage-" + TD.lang.rndStr());
		this.cfg = cfg || {};
		this.width = this.cfg.width || 600;
		this.height = this.cfg.height || 540;

		/**
		 * mode 有以下状态：
		 *		 "normal": 普通状态
		 *		 "build": 建造模式
		 */
		this.mode = "normal";

		/*
		 * state 有以下几种状态：
		 * 0: 等待中
		 * 1: 运行中
		 * 2: 暂停
		 * 3: 已结束
		 */
		this.state = 0;
		this.acts = [];
		this.current_act = null;
		this._step2 = TD.lang.nullFunc;

		this._init();
	};

	TD.Stage.prototype = {
		_init: function () {
			if (typeof this.cfg.init == "function") {
				this.cfg.init.call(this);
			}
			if (typeof this.cfg.step2 == "function") {
				this._step2 = this.cfg.step2;
			}
		},
		start: function () {
			this.state = 1;
			TD.lang.each(this.acts, function (obj) {
				obj.start();
			});
		},
		pause: function () {
			this.state = 2;
		},
		gameover: function () {
			//this.pause();
			this.current_act.gameover();
		},
		/**
		 * 清除本 stage 所有物品
		 */
		clear: function () {
			this.state = 3;
			TD.lang.each(this.acts, function (obj) {
				obj.clear();
			});
//		delete this;
		},
		/**
		 * 主循环函数
		 */
		step: function () {
			if (this.state != 1 || !this.current_act) return;
			TD.eventManager.step();
			this.current_act.step();

			this._step2();
		},
		/**
		 * 绘制函数
		 */
		render: function () {
			if (this.state == 0 || this.state == 3 || !this.current_act) return;
			this.current_act.render();
		},
		addAct: function (act) {
			this.acts.push(act);
		},
		addElement: function (el, step_level, render_level) {
			if (this.current_act)
				this.current_act.addElement(el, step_level, render_level);
		}
	};

}); // _TD.a.push end


// _TD.a.push begin
_TD.a.push(function (TD) {

	TD.Act = function (stage, id) {
		this.stage = stage;
		this.id = id || ("act-" + TD.lang.rndStr());

		/*
		 * state 有以下几种状态：
		 * 0: 等待中
		 * 1: 运行中
		 * 2: 暂停
		 * 3: 已结束
		 */
		this.state = 0;
		this.scenes = [];
		this.end_queue = []; // 本 act 结束后要执行的队列，添加时请保证里面全是函数
		this.current_scene = null;

		this._init();
	};

	TD.Act.prototype = {
		_init: function () {
			this.stage.addAct(this);
		},
		/*
		 * 开始当前 act
		 */
		start: function () {
			if (this.stage.current_act && this.stage.current_act.state != 3) {
				// queue...
				this.state = 0;
				this.stage.current_act.queue(this.start);
				return;
			}
			// start
			this.state = 1;
			this.stage.current_act = this;
			TD.lang.each(this.scenes, function (obj) {
				obj.start();
			});
		},
		pause: function () {
			this.state = 2;
		},
		end: function () {
			this.state = 3;
			var f;
			while (f = this.end_queue.shift()) {
				f();
			}
			this.stage.current_act = null;
		},
		queue: function (f) {
			this.end_queue.push(f);
		},
		clear: function () {
			this.state = 3;
			TD.lang.each(this.scenes, function (obj) {
				obj.clear();
			});
//		delete this;
		},
		step: function () {
			if (this.state != 1 || !this.current_scene) return;
			this.current_scene.step();
		},
		render: function () {
			if (this.state == 0 || this.state == 3 || !this.current_scene) return;
			this.current_scene.render();
		},
		addScene: function (scene) {
			this.scenes.push(scene);
		},
		addElement: function (el, step_level, render_level) {
			if (this.current_scene)
				this.current_scene.addElement(el, step_level, render_level);
		},
		gameover: function () {
			//this.is_paused = true;
			//this.is_gameover = true;
			this.current_scene.gameover();
		}
	};

}); // _TD.a.push end


// _TD.a.push begin
_TD.a.push(function (TD) {

	TD.Scene = function (act, id) {
		this.act = act;
		this.stage = act.stage;
		this.is_gameover = false;
		this.id = id || ("scene-" + TD.lang.rndStr());
		/*
		 * state 有以下几种状态：
		 * 0: 等待中
		 * 1: 运行中
		 * 2: 暂停
		 * 3: 已结束
		 */
		this.state = 0;
		this.end_queue = []; // 本 scene 结束后要执行的队列，添加时请保证里面全是函数
		this._step_elements = [
			// step 共分为 3 层
			[],
			// 0
			[],
			// 1 默认
			[] // 2
		];
		this._render_elements = [ // 渲染共分为 10 层
			[], // 0 背景 1 背景图片
			[], // 1 背景 2
			[], // 2 背景 3 地图、格子
			[], // 3 地面 1 一般建筑
			[], // 4 地面 2 人物、NPC等
			[], // 5 地面 3
			[], // 6 天空 1 子弹等
			[], // 7 天空 2 主地图外边的遮罩，panel
			[], // 8 天空 3
			[] // 9 系统特殊操作，如选中高亮，提示、文字遮盖等
		];

		this._init();
	};

	TD.Scene.prototype = {
		_init: function () {
			this.act.addScene(this);
			this.wave = 0; // 第几波
		},
		start: function () {
			if (this.act.current_scene &&
				this.act.current_scene != this &&
				this.act.current_scene.state != 3) {
				// queue...
				this.state = 0;
				this.act.current_scene.queue(this.start);
				return;
			}
			// start
			this.state = 1;
			this.act.current_scene = this;
		},
		pause: function () {
			this.state = 2;
		},
		end: function () {
			this.state = 3;
			var f;
			while (f = this.end_queue.shift()) {
				f();
			}
			this.clear();
			this.act.current_scene = null;
		},
		/**
		 * 清空场景
		 */
		clear: function () {
			// 清空本 scene 中引用的所有对象以回收内存
			TD.lang.shift(this._step_elements, function (obj) {
				TD.lang.shift(obj, function (obj2) {
					// element
					//delete this.scene;
					obj2.del();
//				delete this;
				});
//			delete this;
			});
			TD.lang.shift(this._render_elements, function (obj) {
				TD.lang.shift(obj, function (obj2) {
					// element
					//delete this.scene;
					obj2.del();
//				delete this;
				});
//			delete this;
			});
//		delete this;
		},
		queue: function (f) {
			this.end_queue.push(f);
		},
		gameover: function () {
			if (this.is_gameover) return;
			this.pause();
			this.is_gameover = true;
		},
		step: function () {
			if (this.state != 1) return;
			if (TD.life <= 0) {
				TD.life = 0;
				this.gameover();
			}

			var i, a;
			for (i = 0; i < 3; i ++) {
				a = [];
				var level_elements = this._step_elements[i];
				TD.lang.shift(level_elements, function (obj) {
					if (obj.is_valid) {
						if (!obj.is_paused)
							obj.step();
						a.push(obj);
					} else {
						setTimeout(function () {
							obj = null;
						}, 500); // 一会儿之后将这个对象彻底删除以收回内存
					}
				});
				this._step_elements[i] = a;
			}
		},
		render: function () {
			if (this.state == 0 || this.state == 3) return;
			var i, a,
				ctx = TD.ctx;

			ctx.clearRect(0, 0, this.stage.width, this.stage.height);

			for (i = 0; i < 10; i ++) {
				a = [];
				var level_elements = this._render_elements[i];
				TD.lang.shift(level_elements, function (obj) {
					if (obj.is_valid) {
						if (obj.is_visiable)
							obj.render();
						a.push(obj);
					}
				});
				this._render_elements[i] = a;
			}

			if (this.is_gameover) {
				this.panel.gameover_obj.show();
			}
		},
		addElement: function (el, step_level, render_level) {
			//TD.log([step_level, render_level]);
			step_level = step_level || el.step_level || 1;
			render_level = render_level || el.render_level;
			this._step_elements[step_level].push(el);
			this._render_elements[render_level].push(el);
			el.scene = this;
			el.step_level = step_level;
			el.render_level = render_level;
		}
	};

}); // _TD.a.push end
