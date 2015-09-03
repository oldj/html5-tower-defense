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

	/**
	 * 事件管理器
	 */
	TD.eventManager = {
		ex: -1, // 事件坐标 x
		ey: -1, // 事件坐标 y
		_registers: {}, // 注册监听事件的元素

		// 目前支持的事件类型
		ontypes: [
			"enter", // 鼠标移入
			"hover", // 鼠标在元素上，相当于 onmouseover
			"out", // 鼠标移出
			"click" // 鼠标点击
		],

		// 当前事件类型
		current_type: "hover",

		/**
		 * 根据事件坐标，判断事件是否在元素上
		 * @param el {Element} Element 元素
		 * @return {Boolean}
		 */
		isOn: function (el) {
			return (this.ex != -1 &&
			this.ey != -1 &&
			this.ex > el.x &&
			this.ex < el.x2 &&
			this.ey > el.y &&
			this.ey < el.y2);
		},

		/**
		 * 根据元素名、事件名，生成一个字符串标识，用于注册事件监听
		 * @param el {Element}
		 * @param evt_type {String}
		 * @return evt_name {String} 字符串标识
		 */
		_mkElEvtName: function (el, evt_type) {
			return el.id + "::_evt_::" + evt_type;
		},

		/**
		 * 为元素注册事件监听
		 * 现在的实现比较简单，如果一个元素对某个事件多次注册监听，后面的监听将会覆盖前面的
		 *
		 * @param el {Element}
		 * @param evt_type {String}
		 * @param f {Function}
		 */
		on: function (el, evt_type, f) {
			this._registers[this._mkElEvtName(el, evt_type)] = [el, evt_type, f];
		},

		/**
		 * 移除元素对指定事件的监听
		 * @param el {Element}
		 * @param evt_type {String}
		 */
		removeEventListener: function (el, evt_type) {
			var en = this._mkElEvtName(el, evt_type);
			delete this._registers[en];
		},

		/**
		 * 清除所有监听事件
		 */
		clear: function () {
			delete this._registers;
			this._registers = {};
			//this.elements = [];
		},

		/**
		 * 主循环方法
		 */
		step: function () {
			if (!this.current_type) return; // 没有事件被触发

			var k, a, el, et, f,
			//en,
				j,
				_this = this,
				ontypes_len = this.ontypes.length,
				is_evt_on,
//				reg_length = 0,
				to_del_el = [];

			//var m = TD.stage.current_act.current_scene.map;
			//TD.log([m.is_hover, this.isOn(m)]);

			// 遍历当前注册的事件
			for (k in this._registers) {
//				reg_length ++;
				if (!this._registers.hasOwnProperty(k)) continue;
				a = this._registers[k];
				el = a[0]; // 事件对应的元素
				et = a[1]; // 事件类型
				f = a[2]; // 事件处理函数
				if (!el.is_valid) {
					to_del_el.push(el);
					continue;
				}
				if (!el.is_visiable) continue; // 不可见元素不响应事件

				is_evt_on = this.isOn(el); // 事件是否发生在元素上

				if (this.current_type != "click") {
					// enter / out / hover 事件

					if (et == "hover" && el.is_hover && is_evt_on) {
						// 普通的 hover
						f();
						this.current_type = "hover";
					} else if (et == "enter" && !el.is_hover && is_evt_on) {
						// enter 事件
						el.is_hover = true;
						f();
						this.current_type = "enter";
					} else if (et == "out" && el.is_hover && !is_evt_on) {
						// out 事件
						el.is_hover = false;
						f();
						this.current_type = "out";
//					} else {
						// 事件与当前元素无关
//					continue;
					}

				} else {
					// click 事件
					if (is_evt_on && et == "click") f();
				}
			}

			// 删除指定元素列表的事件
			TD.lang.each(to_del_el, function (obj) {
				for (j = 0; j < ontypes_len; j++)
					_this.removeEventListener(obj, _this.ontypes[j]);
			});
//			TD.log(reg_length);
			this.current_type = "";
		},

		/**
		 * 鼠标在元素上
		 * @param ex {Number}
		 * @param ey {Number}
		 */
		hover: function (ex, ey) {
			// 如果还有 click 事件未处理则退出，点击事件具有更高的优先级
			if (this.current_type == "click") return;

			this.current_type = "hover";
			this.ex = ex;
			this.ey = ey;
		},

		/**
		 * 点击事件
		 * @param ex {Number}
		 * @param ey {Number}
		 */
		click: function (ex, ey) {
			this.current_type = "click";
			this.ex = ex;
			this.ey = ey;
		}
	};

}); // _TD.a.push end

