/*
 * Copyright (c) 2011.
 *
 * Author: oldj <oldj.wu@gmail.com>
 * Blog: http://oldj.net/
 *
 * Last Update: 2011/1/10 5:22:52
 */
/** 本文件定义了 Element 类，这个类是游戏中所有元素的基类，
 * 包括地图、格子、怪物、建筑、子弹、气球提示等都基于这个类
 *
 */


// _TD.a.push begin
_TD.a.push(function (TD) {

	/**
	 * Element 是游戏中所有可控制元素的基类
	 * @param id {String} 给这个元素一个唯一的不重复的 ID，如果不指定则随机生成
	 * @param cfg {Object} 元素的配置信息
	 */
	TD.Element = function (id, cfg) {
		this.id = id || ("el-" + TD.lang.rndStr());
		this.cfg = cfg || {};

		this.is_valid = true;
		this.is_visiable = typeof cfg.is_visiable != "undefined" ? cfg.is_visiable : true;
		this.is_paused = false;
		this.is_hover = false;
		this.x = this.cfg.x || -1;
		this.y = this.cfg.y || -1;
		this.width = this.cfg.width || 0;
		this.height = this.cfg.height || 0;
		this.step_level = cfg.step_level || 1;
		this.render_level = cfg.render_level;
		this.on_events = cfg.on_events || [];

		this._init();
	};

	TD.Element.prototype = {
		_init: function () {
			var _this = this,
				i, en, len;

			// 监听指定事件
			for (i = 0, len = this.on_events.length; i < len; i ++) {
				en = this.on_events[i];
				switch (en) {

					// 鼠标进入元素
					case "enter":
						this.on("enter", function () {
							_this.onEnter();
						});
						break;

					// 鼠标移出元素
					case "out":
						this.on("out", function () {
							_this.onOut();
						});
						break;

					// 鼠标在元素上，相当于 DOM 中的 onmouseover
					case "hover":
						this.on("hover", function () {
							_this.onHover();
						});
						break;

					// 鼠标点击了元素
					case "click":
						this.on("click", function () {
							_this.onClick();
						});
						break;
				}
			}
			this.caculatePos();
		},
		/**
		 * 重新计算元素的位置信息
		 */
		caculatePos: function () {
			this.cx = this.x + this.width / 2; // 中心的位置
			this.cy = this.y + this.height / 2;
			this.x2 = this.x + this.width; // 右边界
			this.y2 = this.y + this.height; // 下边界
		},
		start: function () {
			this.is_paused = false;
		},
		pause: function () {
			this.is_paused = true;
		},
		hide: function () {
			this.is_visiable = false;
			this.onOut();
		},
		show: function () {
			this.is_visiable = true;
		},
		/**
		 * 删除本元素
		 */
		del: function () {
			this.is_valid = false;
		},
		/**
		 * 绑定指定类型的事件
		 * @param evt_type {String} 事件类型
		 * @param f {Function} 处理方法
		 */
		on: function (evt_type, f) {
			TD.eventManager.on(this, evt_type, f);
		},

		// 下面几个方法默认为空，实例中按需要重载
		onEnter: TD.lang.nullFunc,
		onOut: TD.lang.nullFunc,
		onHover: TD.lang.nullFunc,
		onClick: TD.lang.nullFunc,
		step: TD.lang.nullFunc,
		render: TD.lang.nullFunc,

		/**
		 * 将当前 element 加入到场景 scene 中
		 * 在加入本 element 之前，先加入 pre_add_list 中的element
		 * @param scene
		 * @param step_level {Number}
		 * @param render_level {Number}
		 * @param pre_add_list {Array} Optional [element1, element2, ...]
		 */
		addToScene: function (scene, step_level, render_level, pre_add_list) {
			this.scene = scene;
			if (isNaN(step_level)) return;
			this.step_level = step_level || this.step_level;
			this.render_level = render_level || this.render_level;

			if (pre_add_list) {
				TD.lang.each(pre_add_list, function (obj) {
					scene.addElement(obj, step_level, render_level);
				});
			}
			scene.addElement(this, step_level, render_level);
		}
	};

}); // _TD.a.push end

