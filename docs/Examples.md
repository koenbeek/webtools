# Examples

Most of these examples use the "paramfile" parameter where the browser reads a json file containing the parameters - this only works when the files are served by a webserver, not when using the file:// protocol with local files

To use these parameters files locally with file:// protocol you could launch chrome with command line option --allow-file-access-from-files (in windows: do a "⊞-r" and type "chrome.exe --allow-file-access-from-files")

Otherwise you can just try the examples from here: <https://koenbeek.github.io/Examples.html>

## bank accounts

- [Computer IBAN to human IBAN format](https://koenbeek.github.io/webtools/replace.html?paramfile=examples/computerIBANtohumanIBAN.json) (or [with url params](https://koenbeek.github.io/webtools/replace.html?m=.{4}&r=%24%26%20&itxt=LU680101576806700096%0AFR7630004000033366175096859%0AES3820951234610304500770%0APL60105000996370639354620713%0AES7804879876521231001632%0ANL31ABNA2057285030%0APT50002700007760748336709%0AFR7620041010054295993916028%0ANL27INGB0243608535%0AIT97T0542811101014609483786%0ALU790010768994155852%0AFR7630004000035166056224336%0ANL86RABO6039596031%0ABE13299810640039%0ALU280014618950303508))
- [BBAN to IBAN for several countries](https://koenbeek.github.io/webtools/bban2iban.html?paramfile=examples/BBAN2IBAN.json)

## XML files

- [extract data from pain001 file](https://koenbeek.github.io/webtools/xpathslist.html?paramfile=examples/pain001.json)

## Other tools

- [sort using separators](https://koenbeek.github.io/webtools/sort.html?paramfile=examples/sort.json) or [sort using key extraction](https://koenbeek.github.io/webtools/sort.html?paramfile=examples/sort2.json)
