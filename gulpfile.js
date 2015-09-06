/**
 * author: oldj
 */

var gulp = require("gulp");
var uglify = require("gulp-uglify");
var browserify = require("gulp-browserify");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var args = require("yargs").argv;

var IS_DEBUG = !!args.debug;
console.log("IS_DEBUG: ", IS_DEBUG);
console.log("--------------------");

gulp.task("scripts", function () {
	function doTask(lang) {
		gulp.src([
			"src/js/td.js"
			, "src/js/td-lang.js"
			, "src/js/td-event.js"
			, "src/js/td-stage.js"
			, "src/js/td-element.js"
			, "src/js/td-obj-map.js"
			, "src/js/td-obj-grid.js"
			, "src/js/td-obj-building.js"
			, "src/js/td-obj-monster.js"
			, "src/js/td-obj-panel.js"
			, "src/js/td-data-stage-1.js"
			, "src/js/td-cfg-buildings.js"
			, "src/js/td-cfg-monsters.js"
			, "src/js/td-render-buildings.js"
			, "src/js/td-msg-" + (lang || "") + ".js"
			, "src/js/td-walk.js"

		])
			.pipe(sourcemaps.init())
			.pipe(concat("td-pkg-" + lang + "-min.js"))
			.pipe(uglify({
				compress: {
					drop_console: !IS_DEBUG
				}
			}))
			.pipe(sourcemaps.write("./"))
			.pipe(gulp.dest("build"))
		;
	}

	doTask("zh");
	doTask("en");
});

gulp.task("default", function () {
	gulp.start("scripts");
	gulp.watch([
		"src/**/*.js"
	], [
		"scripts"
	]);
});

