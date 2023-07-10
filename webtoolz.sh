#!/usr/bin/env bash

# clean up webtoolz folder

rm -fr webtoolz/*

# copy subfolders css, docs and examples from docs/webtools to webtoolz 

cp -fr docs/webtools/css docs/webtools/docs docs/webtools/examples webtoolz

# create temp .txt file containing js library code/text to include in htmls

cat <<EOT > includelib.txt


// START OF LIB CODE INCLUDE - lib.js and acc.js

EOT

cat docs/webtools/js/lib.js docs/webtools/js/acc.js | grep -v "^ *import " | grep -v "^ *export " >> includelib.txt

cat <<EOT >> includelib.txt

// END OF LIB CODE INCLUDE - lib.js and acc.js


EOT

# for each .html in docs/webtools
# - remove all import clauses
# - add code for docs/webtools/js/lib.js and acc.js at beginning of <script> but remove import clauses

for src in docs/webtools/*.html; do
  myhtml="webtoolz/${src##*/}"
  cat $src | grep -v "^ *import " > ${myhtml}.tmp
  sed '/^  await doSetup/e cat includelib.txt' ${myhtml}.tmp > $myhtml
  rm ${myhtml}.tmp
done
rm includelib.txt