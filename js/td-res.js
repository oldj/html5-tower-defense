/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-res.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-22 16:51:33
* Last Update: 2010-11-28 15:18:06
*
*/

// _TD.a.push begin
_TD.a.push(function (TD) {

TD.res = {};

var res = [
	["grass", "res/grass.png"],
	["entrance", "res/entrance.png"],
	["long-grass", "res/long-grass.png"],
	["compsite", "res/compsite.png"],
	["weapon-cannon", "res/cannon.png?r=" + Math.random()],
	["weapon-LMG", "res/LMG.png?r=" + Math.random()],
	["weapon-HMG", "res/HMG.png?r=" + Math.random()],
	["wall", "res/wire-netting.png"],
	["monster-0", "res/162-Small04.png"], // monster-0
	["monster-default", "res/161-Small03.png"],
	null
];

TD.res_to_load = res.length - 1;

function loadRes(key, src) {
	TD.res[key] = {
		img: new Image(),
		src: src,
		is_valid: false
	};
	TD.res[key].img.onload = function () {
		TD.res[key].is_valid = true;
		TD.res_to_load --;
	};
	TD.res[key].img.src = src;
}

for (var i = 0, l = res.length - 1; i < l; i ++) {
	loadRes(res[i][0], res[i][1]);
}

}); // _TD.a.push end

