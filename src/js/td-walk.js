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
		this.fPassable = typeof f_passable == "function" ? f_passable : function () {
			return true;
		};

		this._init();
	};

	TD.FindWay.prototype = {
		_init: function () {
			if (this.x1 == this.x2 && this.y1 == this.y2) {
				// 如果输入的坐标已经是终点了
				this.is_arrived = true;
				this.way = [
					[this.x1, this.y1]
				];
				return;
			}

			for (var i = 0; i < this.len; i++)
				this.m[i] = -2; // -2 表示未探索过，-1 表示不可到达

			this.x = this.x1;
			this.y = this.y1;
			this.distance = 0;
			this.current = [
				[this.x, this.y]
			]; // 当前一步探索的格子

			this.setVal(this.x, this.y, 0);

			while (this.next()) {
			}
		},
		getVal: function (x, y) {
			var p = y * this.w + x;
			return p < this.len ? this.m[p] : -1;
		},
		setVal: function (x, y, v) {
			var p = y * this.w + x;
			if (p > this.len) return false;
			this.m[p] = v;
		},
		/**
		 * 得到指定坐标的邻居，即从指定坐标出发，1 步之内可以到达的格子
		 * 目前返回的是指定格子的上、下、左、右四个邻格
		 * @param x {Number}
		 * @param y {Number}
		 */
		getNeighborsOf: function (x, y) {
			var nbs = [];
			if (y > 0) nbs.push([x, y - 1]);
			if (x < this.w - 1) nbs.push([x + 1, y]);
			if (y < this.h - 1) nbs.push([x, y + 1]);
			if (x > 0) nbs.push([x - 1, y]);

			return nbs;
		},
		/**
		 * 取得当前一步可到达的 n 个格子的所有邻格
		 */
		getAllNeighbors: function () {
			var nbs = [], nb1, i, c, l = this.current.length;
			for (i = 0; i < l; i++) {
				c = this.current[i];
				nb1 = this.getNeighborsOf(c[0], c[1]);
				nbs = nbs.concat(nb1);
			}
			return nbs;
		},
		/**
		 * 从终点倒推，寻找从起点到终点最近的路径
		 * 此处的实现是，从终点开始，从当前格子的邻格中寻找值最低（且大于 0）的格子，
		 * 直到到达起点。
		 * 这个实现需要反复地寻找邻格，有时邻格中有多个格子的值都为最低，这时就从中
		 * 随机选取一个。还有一种实现方式是在一开始的遍历中，给每一个到达过的格子添加
		 * 一个值，指向它的来时的格子（父格子）。
		 */
		findWay: function () {
			var x = this.x2,
				y = this.y2,
				nb, max_len = this.len,
				nbs_len,
				nbs, i, l, v, min_v = -1,
				closest_nbs;

			while ((x != this.x1 || y != this.y1) && min_v != 0 &&
			this.way.length < max_len) {

				this.way.unshift([x, y]);

				nbs = this.getNeighborsOf(x, y);
				nbs_len = nbs.length;
				closest_nbs = [];

				// 在邻格中寻找最小的 v
				min_v = -1;
				for (i = 0; i < nbs_len; i++) {
					v = this.getVal(nbs[i][0], nbs[i][1]);
					if (v < 0) continue;
					if (min_v < 0 || min_v > v)
						min_v = v;
				}
				// 找出所有 v 最小的邻格
				for (i = 0; i < nbs_len; i++) {
					nb = nbs[i];
					if (min_v == this.getVal(nb[0], nb[1])) {
						closest_nbs.push(nb);
					}
				}

				// 从 v 最小的邻格中随机选取一个作为当前格子
				l = closest_nbs.length;
				i = l > 1 ? Math.floor(Math.random() * l) : 0;
				nb = closest_nbs[i];

				x = nb[0];
				y = nb[1];
			}
		},
		/**
		 * 到达终点
		 */
		arrive: function () {
			this.current = [];
			this.is_arrived = true;

			this.findWay();
		},
		/**
		 * 道路被阻塞
		 */
		blocked: function () {
			this.current = [];
			this.is_blocked = true;
		},
		/**
		 * 下一次迭代
		 * @return {Boolean} 如果返回值为 true ，表示未到达终点，并且道路
		 *      未被阻塞，可以继续迭代；否则表示不必继续迭代
		 */
		next: function () {
			var neighbors = this.getAllNeighbors(), nb,
				l = neighbors.length,
				valid_neighbors = [],
				x, y,
				i, v;

			this.distance++;

			for (i = 0; i < l; i++) {
				nb = neighbors[i];
				x = nb[0];
				y = nb[1];
				if (this.getVal(x, y) != -2) continue; // 当前格子已探索过
				//grid = this.map.getGrid(x, y);
				//if (!grid) continue;

				if (this.fPassable(x, y)) {
					// 可通过

					/**
					 * 从起点到当前格子的耗费
					 * 这儿只是简单地把从起点到当前格子需要走几步作为耗费
					 * 比较复杂的情况下，可能还需要考虑不同的路面耗费也会不同，
					 * 比如沼泽地的耗费比平地要多。不过现在的版本中路况没有这么复杂，
					 * 先不考虑。
					 */
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


