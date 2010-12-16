# -*- coding: utf-8 -*-

u"""
发布脚本

此脚本把 src 目录下的 js 合并成一个，压缩，放到 build 目录下，
再更新 build/td.html 里 .js 文件的时间戳以防止浏览器缓存。
"""

import os
import re
import time

from compressor import compressor


def updateHTML():
	u"更新 td.html 中 js 文件的时间戳，以防止最终访问页面时的缓存"

	tdh = "../build/td.html"
	tdh = tdh.replace("/", os.sep)
	html = open(tdh).read()
	html = re.sub(r"\.js\?fmts=[\d\.]+", ".js?fmts=%.1f" % time.time(), html)
	open(tdh, "w").write(html)


def compress(fn):
	u"压缩合并后的文件，需要网络支持"

	print "compressing..."
	path, filename = os.path.split(fn)
	compressed_fn = os.path.join(path, filename.replace("-pkg.js", "-pkg-min.js"))
	compressor(compressed_fn, fn)
	print "compressed!"


def merge():
	u"合并文件"

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

	print "merged!"

	return build_path

if __name__ == "__main__":
	fn = merge()
	compress(fn)
	updateHTML()
	print "done!"
