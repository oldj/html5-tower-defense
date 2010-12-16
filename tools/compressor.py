#!/usr/bin/python2.6
# @author: allenm, oldj
#
# @link: https://github.com/allenm/js-css-compressor
# @link: https://github.com/oldj/js-css-compressor
#

import httplib
import urllib
import sys
import os

# Define the parameters for the POST request and encode them in
# a URL-safe format.


def compressor(savename, filenames):
    ''' compressor and combine the javascript files. This script use the google closure REST API '''

    filenames = (v.strip() for v in filenames.split(";"))
    code = []
    for fn in filenames:
        if fn.startswith('http://'):
            # url
            code.append(('code_url', fn))
        else:
            # local file
            if not os.path.isfile(fn):
                print 'ERROR: "%s" is not a valid file!' % fn
                return False
            code.append(('js_code', open(fn).read()))

    code.extend([
            ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
            ('output_format', 'text'),
            ('output_info', 'compiled_code'),
        ])

    params = urllib.urlencode(code)

    # Always use the following value for the Content-type header.
    headers = {'Content-type': 'application/x-www-form-urlencoded'}
    conn = httplib.HTTPConnection('closure-compiler.appspot.com')
    conn.request('POST', '/compile', params, headers)
    response = conn.getresponse()
    data = response.read()
    print 'DATA:'
    print '-' * 50
    print data.rstrip()
    conn.close()

    donefile = open(savename, 'w')
    donefile.write(data)
    donefile.close()

    print '-' * 50
    print '>> out: %s (%.2fK)' % (savename, len(data) / 1024.0)


if __name__ == "__main__":

    if sys.argv.__len__() >= 3:
        compressor(sys.argv[1], sys.argv[2])
    else:
        print '''This script must contain at least two parameters.
The first one is the filename which you want store the data after compress,
the second is the urls or filenames of javascript file which you want compress,
if you have more than one file to compress,
use ";" to partition them.'''
