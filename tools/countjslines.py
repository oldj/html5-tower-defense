# -*- coding: utf-8 -*-
#
# 统计指定文件夹下的 js 一共有多少行

import os
from glob import glob

src_folder = "../src/js"

if __name__ == "__main__":
	print "lines: %d" % sum(len(open(fn).readlines()) for \
		fn in glob(os.path.join(src_folder.replace("/", os.sep), "*.js")))
	raw_input("")

