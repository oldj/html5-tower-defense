# -*- coding: utf-8 -*-

import os

def merge():

	src_folder = "../src/js"
	files = [
		"td.js", "td-lang.js", "td-event.js",
		"td-stage.js", "td-element.js",
		"td-obj-map.js", "td-obj-grid.js",
		"td-obj-building.js", "td-obj-monster.js",
		"td-obj-panel.js", "td-data-stage-1.js",
		"td-cfg-buildings.js", "td-cfg-monsters.js",
		"td-render-buildings.js", "td-msg.js",
		"td-walk.js",
	]
	build_folder = "../build"
	build_name = "td-pkg.js"

	print "merging..."
	src_folder = src_folder.replace("/", os.sep)
	build_folder = build_folder.replace("/", os.sep)
	c = "/** %s */" % build_name

	for fn in files:
		fn = os.path.join(src_folder, fn)
		if os.path.isfile(fn):
			c = "%s\n\n%s" % (c, open(fn).read())
		else:
			print "ERROR: '%s' is not a file!" % fn
			return

	build_path = os.path.join(build_folder, build_name)
	print "save to '%s'" % build_path
	open(build_path, "w").write(c)

	print "done!"

if __name__ == "__main__":
	merge()
