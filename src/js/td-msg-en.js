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

	TD._msg_texts = {
		"_cant_build": "Can't build here!",
		"_cant_pass": "Can't pass!",
		"entrance": "Entrance",
		"exit": "Exit",
		"not_enough_money": "Not enough money, need $${0}.",
		"wave_info": "Wave ${0}",
		"panel_money_title": "Money: ",
		"panel_score_title": "Score: ",
		"panel_life_title": "Life: ",
		"panel_building_title": "Buildings: ",
		"panel_monster_title": "Monsters: ",
		"building_name_block": "Roadblock",
		"building_name_cannon": "Cannon",
		"building_name_LMG": "LMG",
		"building_name_HMG": "HMG",
		"building_name_laser_gun": "Laser gun",
		"building_info": "${0}: Level ${1}, Damage ${2}, Speed ${3}, Range ${4}, Kill ${5}",
		"building_info_wall": "${0}",
		"building_intro_wall": "Roadblock: monsters could not pass ($${0})",
		"building_intro_cannon": "Cannon: blance in range and damage ($${0})",
		"building_intro_LMG": "Light Machine Gun: longer range, normal damage ($${0})",
		"building_intro_HMG": "Heavy Machine Gun: fast shoot, greater damage, normal range ($${0})",
		"building_intro_laser_gun": "Laser gun: greater damage, 100% hit ($${0})",
		"click_to_build": "Left click to build ${0} ($${1})",
		"upgrade": "Upgrade ${0} to level ${1} , cost $${2}。",
		"sell": "Sell ${0} for $${1}",
		"upgrade_success": "Upgrade success! ${0} upgrades to level ${1}. Next upgrade will take $${2}.",
		"monster_info": "Monster: Life ${0}, Shield ${1}, Speed ${2}, Damage ${3}",
		"button_upgrade_text": "Upgrade",
		"button_sell_text": "Sell",
		"button_start_text": "Start",
		"button_restart_text": "Restart",
		"button_pause_text": "Pause",
		"button_continue_text": "Continue",
		"button_pause_desc_0": "Pause the game",
		"button_pause_desc_1": "Resume the game",
		"blocked": "Can't build here, it will block the way from entrance to exit!",
		"monster_be_blocked": "Can't build here, some monster will be blocked!",
		"entrance_or_exit_be_blocked": "Can't build on the entrance or the exit!",
		"_": "ERROR"
	};

	TD._t = TD.translate = function (k, args) {
		args = (typeof args == "object" && args.constructor == Array) ? args : [];
		var msg = this._msg_texts[k] || this._msg_texts["_"],
			i,
			l = args.length;
		for (i = 0; i < l; i++) {
			msg = msg.replace("${" + i + "}", args[i]);
		}

		return msg;
	};


}); // _TD.a.push end
