/**
*
* Author:
*	oldj <oldj.wu@gmail.com>
*	http://oldj.net/
*
* File: td-cfg-building.js
* @save-up: [td.js, ../td.html]
*
* Create Date: 2010-11-13 08:34:24
* Last Update: 2010-11-21 16:48:28
*
*/

// _TD.a.push begin
_TD.a.push(function (TD) {

	TD.default_upgrade_rule = function (old_level, old_value) {
		return old_value * 1.2;
	};

	TD.getDefaultBuildingAttributes = function (building_type) {

		var building_attributes = {
			"wall": {
				damage: 0,
				range: 0,
				speed: 0,
				bullet_speed: 0,
				life: 100,
				shield: 500,
				cost: 5
			},
			"cannon": {
				damage: 8,
				range: 4,
				max_range: 8,
				speed: 2,
				bullet_speed: 6,
				life: 100,
				shield: 100,
				cost: 300
			},
			"LMG": {
				damage: 3,
				range: 6,
				max_range: 10,
				speed: 3,
				bullet_speed: 6,
				life: 100,
				shield: 50,
				cost: 100
			},
			"HMG": {
				damage: 10,
				range: 3,
				max_range: 6,
				speed: 3,
				bullet_speed: 5,
				life: 100,
				shield: 200,
				cost: 800
			},
			"laser_gun": {
				damage: 80,
				range: 9,
				max_range: 8,
				speed: 2,
				bullet_speed: 10,
				life: 100,
				shield: 100,
				cost: 2000
			}
		};

		return building_attributes[building_type] || {};
	};

}); // _TD.a.push end
