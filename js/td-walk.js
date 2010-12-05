/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-walk.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-12 09:04:13
* Last Update: 2010-11-21 10:32:52
*
*/


// _TD.a.push begin
_TD.a.push(function (TD) {

/**
* 使用 A* 算法（Dijkstra算法？）寻找从 (x1, y1) 到 (x2, y2) 最短的路线
*
*/
TD.FindWay = function (w, h, x1, y1, x2, y2, f_passable) {
	this.m = [];
	this.w = w;
	this.h = h;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.way = [];
	this.len = this.w * this.h;
	this.is_blocked = this.is_arrived = false;
	this.fPassable = typeof f_passable == "function" ? f_passable : function () {return true;};

	this._init();
}

TD.FindWay.prototype = {
	_init: function () {
		if (this.x1 == this.x2 && this.y1 == this.y2) {
			this.is_arrived = true;
			this.way = [[this.x1, this.y1]];
			return;
		}

		for (i = 0; i < this.len; i ++) this.m.push(-2);
		// -2 表示未探索过，-1 表示不可到达
		this.x = this.x1;
		this.y = this.y1;
		this.distance = 0;
		this.current = [[this.x, this.y]]; // 当前探索的格子

		this.setVal(this.x, this.y, 0);

		while (this.next());
	},
	getVal: function (x, y) {
		var p = y * this.w + x;
		if (p > this.len) return -1;
		return this.m[p];
	},
	setVal: function (x, y, v) {
		var p = y * this.w + x;
		if (p > this.len) return false;
		this.m[p] = v;
	},
	getNeighborsOf: function (x, y) {
		var nbs = [];
		if (y > 0) nbs.push([x, y - 1]);
		if (x < this.w - 1) nbs.push([x + 1, y]);
		if (y < this.h - 1) nbs.push([x, y + 1]);
		if (x > 0) nbs.push([x - 1, y]);

		return nbs;
	},
	getAllNeigbhors: function () {
		var nbs = [], nb1, i, j, c, l = this.current.length;
		for (i = 0; i < l; i ++) {
			c = this.current[i];
			nb1 = this.getNeighborsOf(c[0], c[1]);
			nbs = nbs.concat(nb1);
		}
		return nbs;
	},
	findWay: function () {
		var x = this.x2,
			y = this.y2,
			nb, max_len = this.len,
			nbs, i, l, v, min_v = -1,
			closest_nbs;

		while ((x != this.x1 || y != this.y1) && min_v != 0 && this.way.length < max_len) {
			this.way.unshift([x, y]);

			nbs = this.getNeighborsOf(x, y);
			closest_nbs = [];
			min_v = -1;
			for (i = 0; i < nbs.length; i ++) {
				v = this.getVal(nbs[i][0], nbs[i][1]);
				if (v < 0) continue;
				if (min_v < 0 || min_v > v)
					min_v = v;
			}
			for (i = 0; i < nbs.length; i ++) {
				nb = nbs[i];
				if (min_v == this.getVal(nb[0], nb[1])) {
					closest_nbs.push(nb);
				}
			}
			l = closest_nbs.length;
			i = l > 1 ? Math.floor(Math.random() * l) : 0;
			nb = closest_nbs[i];

			x = nb[0];
			y = nb[1];
		}
	},
	arrive: function (x, y) {
		this.current = [];
		this.is_arrived = true;

		this.findWay();
	},
	blocked: function () {
		this.current = [];
		this.is_blocked = true;
	},
	next: function () {
		var neighbors = this.getAllNeigbhors(), nb, grid,
			l = neighbors.length,
			valid_neighbors = [],
			x, y, p,
			i, v;

		this.distance ++;

		for (i = 0; i < l; i ++) {
			nb = neighbors[i];
			x = nb[0];
			y = nb[1];
			if (this.getVal(x, y) != -2) continue;
			//grid = this.map.getGrid(x, y);
			//if (!grid) continue;

			if (this.fPassable(x, y)) {
				// 可通过
				v = this.distance;
				valid_neighbors.push(nb);
			} else {
				// 不可通过或有建筑挡着
				v = -1;
			}

			this.setVal(x, y, v);

			if (x == this.x2 && y == this.y2) {
				this.arrive();
				return false;
			}
		}

		if (valid_neighbors.length == 0) {
			this.blocked();
			return false
		}
		this.current = valid_neighbors;

		return true;
	}
};

}); // _TD.a.push end


