#!/usr/bin/env bash

pwd
wd=$(dirname $0)

(cd ${wd}/formatyaya && make)
mv ${wd}/formatyaya/out/* ./out/ -v
