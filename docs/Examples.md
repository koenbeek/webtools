# Examples

These examples use the "paramfile" parameter where the browser reads a json file containing the parameters - this only works when the files are served by a webserver, not when using the file:// protocol with local files

To use these parameters files locally with file:// protocol you could launch chrome with command line option --allow-file-access-from-files (in windows: do a "⊞-r" and type "chrome.exe --allow-file-access-from-files")

Or you can use the [examples that put all the parameters in the URL](webtools/_Examples.html) 

## Bank accounts

- [Computer IBAN to human IBAN format](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/computerIBANtohumanIBAN.json) 
- BBAN to IBAN format
    - [For several countries](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/BBAN2IBAN.json)
    - [BE accounts to human IBAN format](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/BBAN2IBAN2.json)
- [List a random set of IBAN numbers](https://koenbeek.github.io/webtools/tools.html?tool1=exampleibans)


## XML files

- [Extract data from pain001 file](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/pain001.json)
- [Extract nodes from xml file](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/xpathlist.json)

## Other tools

- [Sort using separators](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/sort.json) or [Sort using key extraction](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/sort2.json)
- Matching text with [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
    - [Get word at start of each line](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/grep.json)
    - [Find first 4-letter word on each line](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/grep2.json)
    - [Find first 4-letter lowercase word on each line](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/grep3.json)
    - [Find all lines with words of 7 characters or more](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/grep4.json)
- [Make a list of a set of lines](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/lines2list.json)
- list regexp matches from a text
    - [List all words from a text](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/matchlist.json)
    - [List first word from each line](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/matchlist2.json)
    - [List first lowercase word from each line](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/matchlist3.json)
    - [List word at start of Text](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/matchlist4.json)
    - [List word at start of each line](https://koenbeek.github.io/webtools/tools.html?paramfile=examples/matchlist5.json)
