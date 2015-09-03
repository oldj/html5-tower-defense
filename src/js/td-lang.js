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

	TD.lang = {
		/**
		 * document.getElementById 方法的简写
		 * @param el_id {String}
		 */
		$e: function (el_id) {
			return document.getElementById(el_id);
		},

		/**
		 * 创建一个 DOM 元素
		 * @param tag_name {String}
		 * @param attributes {Object}
		 * @param parent_node {HTMLElement}
		 * @return {HTMLElement}
		 */
		$c: function (tag_name, attributes, parent_node) {
			var el = document.createElement(tag_name);
			attributes = attributes || {};

			for (var k in attributes) {
				if (attributes.hasOwnProperty(k)) {
					el.setAttribute(k, attributes[k]);
				}
			}

			if (parent_node)
				parent_node.appendChild(el);

			return el;
		},

		/**
		 * 从字符串 s 左边截取n个字符
		 * 如果包含汉字，则汉字按两个字符计算
		 * @param s {String} 输入的字符串
		 * @param n {Number}
		 */
		strLeft: function (s, n) {
			var s2 = s.slice(0, n),
				i = s2.replace(/[^\x00-\xff]/g, "**").length;
			if (i <= n) return s2;
			i -= s2.length;
			switch (i) {
				case 0:
					return s2;
				case n:
					return s.slice(0, n >> 1);
				default:
					var k = n - i,
						s3 = s.slice(k, n),
						j = s3.replace(/[\x00-\xff]/g, "").length;
					return j ?
					s.slice(0, k) + this.arguments.callee(s3, j) :
						s.slice(0, k);
			}
		},

		/**
		 * 取得一个字符串的字节长度
		 * 汉字等字符长度算2，英文、数字等算1
		 * @param s {String}
		 */
		strLen2: function (s) {
			return s.replace(/[^\x00-\xff]/g, "**").length;
		},

		/**
		 * 对一个数组的每一个元素执行指定方法
		 * @param list {Array}
		 * @param f {Function}
		 */
		each: function (list, f) {
			if (Array.prototype.forEach) {
				list.forEach(f);
			} else {
				for (var i = 0, l = list.length; i < l; i++) {
					f(list[i]);
				}
			}
		},

		/**
		 * 对一个数组的每一项依次执行指定方法，直到某一项的返回值为 true
		 * 返回第一个令 f 值为 true 的元素，如没有元素令 f 值为 true，则
		 * 返回 null
		 * @param list {Array}
		 * @param f {Function}
		 * @return {Object}
		 */
		any: function (list, f) {
			for (var i = 0, l = list.length; i < l; i++) {
				if (f(list[i]))
					return list[i];
			}
			return null;
		},

		/**
		 * 依次弹出列表中的元素，并对其进行操作
		 * 注意，执行完毕之后原数组将被清空
		 * 类似于 each，不同的是这个函数执行完后原数组将被清空
		 * @param list {Array}
		 * @param f {Function}
		 */
		shift: function (list, f) {
			while (list[0]) {
				f(list.shift());
//			f.apply(list.shift(), args);
			}
		},

		/**
		 * 传入一个数组，将其随机排序并返回
		 * 返回的是一个新的数组，原数组不变
		 * @param list {Array}
		 * @return {Array}
		 */
		rndSort: function (list) {
			var a = list.concat();
			return a.sort(function () {
				return Math.random() - 0.5;
			});
		},

		_rndRGB2: function (v) {
			var s = v.toString(16);
			return s.length == 2 ? s : ("0" + s);
		},
		/**
		 * 随机生成一个 RGB 颜色
		 */
		rndRGB: function () {
			var r = Math.floor(Math.random() * 256),
				g = Math.floor(Math.random() * 256),
				b = Math.floor(Math.random() * 256);

			return "#" + this._rndRGB2(r) + this._rndRGB2(g) + this._rndRGB2(b);
		},
		/**
		 * 将一个 rgb 色彩字符串转化为一个数组
		 * eg: '#ffffff' => [255, 255, 255]
		 * @param rgb_str {String} rgb色彩字符串，类似于“#f8c693”
		 */
		rgb2Arr: function (rgb_str) {
			if (rgb_str.length != 7) return [0, 0, 0];

			var r = rgb_str.substr(1, 2),
				g = rgb_str.substr(3, 2),
				b = rgb_str.substr(3, 2);

			return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
		},

		/**
		 * 生成一个长度为 n 的随机字符串
		 *
		 * @param [n] {Number}
		 */
		rndStr: function (n) {
			n = n || 16;
			var chars = "1234567890abcdefghijklmnopqrstuvwxyz",
				a = [],
				i, chars_len = chars.length, r;

			for (i = 0; i < n; i++) {
				r = Math.floor(Math.random() * chars_len);
				a.push(chars.substr(r, 1));
			}
			return a.join("");
		},

		/**
		 * 空函数，一般用于占位
		 */
		nullFunc: function () {
		},

		/**
		 * 判断两个数组是否相等
		 *
		 * @param arr1 {Array}
		 * @param arr2 {Array}
		 */
		arrayEqual: function (arr1, arr2) {
			var i, l = arr1.length;

			if (l != arr2.length) return false;

			for (i = 0; i < l; i++) {
				if (arr1[i] != arr2[i]) return false;
			}

			return true;
		},

		/**
		 * 将所有 s 的属性复制给 r
		 * @param r {Object}
		 * @param s {Object}
		 * @param [is_overwrite] {Boolean} 如指定为 false ，则不覆盖已有的值，其它值
		 *      包括 undefined ，都表示 s 中的同名属性将覆盖 r 中的值
		 */
		mix: function (r, s, is_overwrite) {
			if (!s || !r) return r;

			for (var p in s) {
				if (s.hasOwnProperty(p) && (is_overwrite !== false || !(p in r))) {
					r[p] = s[p];
				}
			}
			return r;
		}
	};

}); // _TD.a.push end
