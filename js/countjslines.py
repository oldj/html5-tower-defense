# -*- coding: utf-8 -*-
#
# 统计当前文件夹下的 js 一共有多少行

from glob import glob as g

if __name__ == "__main__":
	print "lines: %d" % sum(len(open(fn).readlines()) for fn in g("*.js"))
	raw_input("")

