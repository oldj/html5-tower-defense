/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-lang.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-17 21:55:36
* Last Update: 2010-11-21 14:58:53
*
*/


// _TD.a.push begin
_TD.a.push(function (TD) {

TD.lang = {
	$e: function (el_id) {
		return document.getElementById(el_id);
	},
	/*
	 * createElement
	 */
	$c: function (tag_name, attributes, parent_node) {
		var el = document.createElement(tag_name);
		attributes = attributes || {};
		for (var k in attributes)
			el.setAttribute(k, attributes[k]);
		if (parent_node)
			parent_node.appendChild(el);

		return el;
	},
	// 从字符串 s 左边截取n个字符
	// 如果包含汉字，则汉字按两个字符计算
	strLeft: function (s, n) {
		var s2 = s.slice(0, n),
			i = s2.replace(/[^\x00-\xff]/g, "**").length;
		if (i <= n) return s2;
		i -= s2.length;
		switch (i) {
			case 0: return s2;
			case n: return s.slice(0, n>>1);
			default:
				var k = n - i,
					s3 = s.slice(k, n),
					j = s3.replace(/[\x00-\xff]/g, "").length;
				return j ? s.slice(0, k) + this.arguments.callee(s3, j) : s.slice(0, k);
		}
	},
	/**
	 * 取得一个字符串的字节长度
	 * 汉字等字符长度算2，英文、数字等算1
	 */
	strLen2: function (s) {
		return s.replace(/[^\x00-\xff]/g, "**").length;
	},
	each: function (list, f, args) {
		var i, l, args2 = [];
		args = args || [];
		for (i = 1, l = args.length; i < l; i ++) {
			args2.push(args[i]);
		}
		for (i = 0, l = list.length; i < l; i ++) {
			f.apply(list[i], args);
		}
	},
	any: function (list, f, args) {
		var i, l, args2 = [];
		args = args || [];
		for (i = 1, l = args.length; i < l; i ++) {
			args2.push(args[i]);
		}
		for (i = 0, l = list.length; i < l; i ++) {
			if (f.apply(list[i], args))
				return list[i];
		}
		return null;
	},
	/*
	 * 依次弹出列表中的元素，并对其进行操作
	 * 注意，执行完毕之后原数组将被清空
	 */
	shift: function (list, f, args) {
		//if (!list) return;
		var i, l, args2 = [];
		args = args || [];
		for (i = 1, l = args.length; i < l; i ++) {
			args2.push(args[i]);
		}
		//while (list && list[0]) {
		while (list[0]) {
			f.apply(list.shift(), args);
		}
	},
	_rndRGB2: function (v) {
		var s = v.toString(16);
		return s.length == 2 ? s : ("0" + s);
	},
	/**
	 * 随机生成一个颜色
	 */
	rndRGB: function () {
		var r = Math.floor(Math.random() * 256),
			g = Math.floor(Math.random() * 256),
			b = Math.floor(Math.random() * 256);
		return "#" + this._rndRGB2(r) + this._rndRGB2(g) + this._rndRGB2(b);
	},
	/**
	 * 生成一个长度为 n 的随机字符串
	 *
	 */
	rndStr: function (n) {
		n = n || 16;
		var chars = "1234567890abcdefghijklmnopqrstuvwxyz",
			a = [],
			i, chars_len = chars.length, r;

		for (i = 0; i < n; i ++) {
			r = Math.floor(Math.random() * chars_len);
			a.push(chars.substr(r, 1));
		}
		return a.join("");
	},
	nullFunc: function () {},
	/**
	 * 判断两个数组是否相等
	 *
	 */
	arrayEqual: function (arr1, arr2) {
		var i, l = arr1.length;
		if (l != arr2.length) return false;
		for (i = 0; i < l; i ++) {
			if (arr1[i] != arr2[i]) return false;
		}
		return true;
	},
	/**
	 * 将所有 s 的属性复制给 r
	 */
	mix: function (r, s, is_overwrite) {
		if (!s || !r) return r;
		if (is_overwrite === undefined) is_overwrite = true;
		var i, p, l;

		for (p in s) {
			if (is_overwrite || !(p in r)) {
				r[p] = s[p];
			}
		}
		return r;
	}
};

}); // _TD.a.push end
