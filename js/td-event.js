/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-event.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-18 16:25:47
* Last Update: 2010-11-22 17:54:46
*
*/


// _TD.a.push begin
_TD.a.push(function (TD) {

TD.eventManager = {
	ex: -1,
	ey: -1,
	_registers: {}, // 注册监听事件的元素
	ontypes: [
		"enter", // 鼠标移入
		"hover",
		"out", // 鼠标移出
		"click"
	],
	current_type: "hover",
	isOn: function (el) {
		var is_on = (this.ex != -1 &&
			this.ey != -1 &&
			this.ex > el.x &&
			this.ex < el.x2 &&
			this.ey > el.y &&
			this.ey < el.y2);

		return is_on;
	},
	_mkElEvtName: function (el, evt_type) {
		return el.id + "::_evt_::" + evt_type;
	},
	/**
	 * 为元素添加事件监听
	 * 后面的监听将会覆盖前面的
	 */
	on: function (el, evt_type, f) {
		this._registers[this._mkElEvtName(el, evt_type)] = [el, evt_type, f];
	},
	removeEventListener: function (el, evt_type) {
		var en = this._mkElEvtName(el, evt_type);
		delete this._registers[en];
	},
	clear: function () {
		this._registers = {};
		//this.elements = [];
	},
	step: function () {
		if (!this.current_type) return; // 没有事件被触发

		var k, a, el, et, f, en, i, j,
			ontypes_len = this.ontypes.length,
			is_evt_on,
			//reg_length = 0,
			to_del_el = [];
		//var m = TD.stage.current_act.current_scene.map;
		//TD.log([m.is_hover, this.isOn(m)]);
		for (k in this._registers) {
			//reg_length ++;
			a = this._registers[k];
			el = a[0]; et = a[1]; f = a[2];
			if (!el.is_valid) {
				to_del_el.push(el);
				continue;
			}
			if (!el.is_visiable) continue;

			is_evt_on = this.isOn(el);
			if (this.current_type != "click") {
				// 判断是否为 enter 或 out 事件
				if (et == "hover" && el.is_hover && is_evt_on) {
					// 普通的 hover
					f();
					this.current_type = "hover";
				} else if (et == "enter" && !el.is_hover && is_evt_on) {
					el.is_hover = true;
					f();
					this.current_type = "enter";
				} else if (et == "out" && el.is_hover && !is_evt_on) {
					el.is_hover = false;
					f();
					this.current_type = "out";
				} else {
					// 事件与当前元素无关
					continue;
				}
			} else {
				// click 事件
				if (is_evt_on && et == "click") f();
			}
		}

		for (i = 0; i < to_del_el.length; i ++) {
			el = to_del_el[i];
			for (j = 0; j < ontypes_len; j ++) {
				this.removeEventListener(el, this.ontypes[i]);
			}
		}
		//TD.log(reg_length);
		this.current_type = "";
	},
	hover: function (ex, ey) {
		if (this.current_type == "click") return; // 还有 click 事件未处理
		this.current_type = "hover";
		this.ex = ex;
		this.ey = ey;
	},
	click: function (ex, ey) {
		this.current_type = "click";
		this.ex = ex;
		this.ey = ey;
	}
};

}); // _TD.a.push end

