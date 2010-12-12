/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-element.js
*
* Create Date: 2010-11-18 15:34:51
*
*/


// _TD.a.push begin
_TD.a.push(function (TD) {

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
			i, en;

		// 监听指定事件
		for (i = 0; i < this.on_events.length; i ++) {
			en = this.on_events[i];
			switch (en) {
				case "enter":
					this.on("enter", function () {
						_this.onEnter();
					});
					break;
				case "out":
					this.on("out", function () {
						_this.onOut();
					});
					break;
				case "hover":
					this.on("hover", function () {
						_this.onHover();
					});
					break;
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
	 * 大小、位置发生了改变
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
	},
	show: function () {
		this.is_visiable = true;
	},
	del: function () {
		this.is_valid = false;
	},
	step: function () {
	},
	render: function () {
	},
	on: function (evt_type, f) {
		TD.eventManager.on(this, evt_type, f);
	},
	onEnter: TD.lang.nullFunc,
	onOut: TD.lang.nullFunc,
	onHover: TD.lang.nullFunc,
	onClick: TD.lang.nullFunc,
	/**
	 * 将当前 element 加入到场景 scene 中
	 * 在加入本 element 之前，先加入 pre_add_list 中的element
	 * @param pre_add_list <Array> Optional [element1, element2..]
	 */
	addToScene: function (scene, step_level, render_level, pre_add_list) {
		var i, l;
		this.scene = scene;
		this.step_level = step_level || this.step_level;
		this.render_level = render_level || this.render_level;
		if (isNaN(step_level)) return;
		if (pre_add_list) {
			for (i = 0, l = pre_add_list.length; i < l; i ++) {
				scene.addElement(pre_add_list[i], step_level, render_level);
			}
		}
		scene.addElement(this, step_level, render_level);
	}
};

}); // _TD.a.push end

