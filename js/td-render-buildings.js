/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-plot-buildings.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-12 14:16:47
* Last Update: 2010-11-28 14:25:52
*
*/

// _TD.a.push begin
_TD.a.push(function (TD) {

	/**
	 * 取得点 (x0, y0) 与点 (x1, y1) 之间的夹角
	 * 返回值为 0 ~ 7 之间的值
	 */
	function getToward(x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0;

		if (dx == 0) {
			return dy >= 0 ? 0 : 2;
		}

		var z = dy / dx,
			j = 2.4142,
			k = 0.4142;
		if (z > j || z < -j) {
			return dy >= 0 ? 0 : 2;
		} else if (z > k) {
			return dy >= 0 ? 4 : 7;
		} else if (z < -k) {
			return dy >= 0 ? 6 : 5;
		} else if (z <= k && z >= -k) {
			return dx >= 0 ? 1 : 3;
		}
	}

	function lineTo2(ctx, x0, y0, x1, y1, len) {
		var x2, y2, a, b, p, xt,
			a2, b2, c2;

		if (x0 == x1) {
			x2 = x0;
			y2 = y1 > y0 ? y0 + len : y0 - len;
		} else if (y0 == y1) {
			y2 = y0;
			x2 = x1 > x0 ? x0 + len : x0 - len;
		} else {
			// 解一元二次方程
			a = (y0 - y1) / (x0 - x1);
			b = y0 - x0 * a;
			a2 = a * a + 1;
			b2 = 2 * (a * (b - y0) - x0);
			c2 = Math.pow(b - y0, 2) + x0 * x0 - Math.pow(len, 2);
			p = Math.pow(b2, 2) - 4 * a2 * c2;
			if (p < 0) {
				//TD.log("ERROR: [a, b, len] = [" + ([a, b, len]).join(", ") + "]");
				return;
			}
			p = Math.sqrt(p);
			xt = (-b2 + p) / (2 * a2);
			if ((x1 - x0 > 0 && xt - x0 > 0) ||
				(x1 - x0 < 0 && xt - x0 < 0)) {
				x2 = xt;
				y2 = a * x2 + b;
			} else {
				x2 = (-b2 - p) / (2 * a2);
				y2 = a * x2 + b;
			}
		}

		ctx.lineCap = "round";
		ctx.moveTo(x0, y0);
		ctx.lineTo(x2, y2);

		return [x2, y2];
	}

	var renderFunctions = {
		"cannon": function (b, ctx, map, gs, gs2, gs2i) {
			var target_position = b.getTargetPosition();

			ctx.drawImage(TD.res["weapon-cannon"].img,
				0, 0, 32, 32, b.x, b.y, 32, 32
			);

			/*ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(b.cx, b.cy);
			b.muzzle = lineTo2(ctx, b.cx, b.cy, target_position[0], target_position[1], gs2);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();*/
		},
		"LMG": function (b, ctx, map, gs, gs2, gs2i) {
			var target_position = b.getTargetPosition();

			ctx.drawImage(TD.res["weapon-LMG"].img,
				0, 0, 32, 32, b.x, b.y, 32, 32
			);

			/*ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(b.cx, b.cy);
			b.muzzle = lineTo2(ctx, b.cx, b.cy, target_position[0], target_position[1], gs2);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();*/
		},
		"HMG": function (b, ctx, map, gs, gs2, gs2i) {
			var target_position = b.getTargetPosition();

			ctx.drawImage(TD.res["weapon-HMG"].img,
				0, 0, 32, 32, b.x, b.y, 32, 32
			);
		},
		"wall": function (b, ctx, map, gs, gs2, gs2i) {
			ctx.drawImage(TD.res["wall"].img,
				0, 0, 32, 32, b.x, b.y, 32, 32
			);
		}
	};

	TD.renderBuilding = function (building) {
		var b = building,
			ctx = TD.ctx,
			map = b.map,
			gs = TD.grid_size,
			gs2 = TD.grid_size / 2,
			gs2i = Math.floor(gs2);

		(renderFunctions[b.type] || renderFunctions["wall"])(
			b, ctx, map, gs, gs2, gs2i
		);
	}

}); // _TD.a.push end
