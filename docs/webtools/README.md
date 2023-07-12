# Webtools

## Basic text tools

- [Lines To List](https://koenbeek.github.io/webtools/lines2list.html) - join data on several lines into 1 line with seperators
- [Sort Lines](https://koenbeek.github.io/webtools/sort.html) - sort lines

## Regular expression text tools

- [Grep](https://koenbeek.github.io/webtools/grep.html) - find lines containing some text pattern
- [List RE Matches](https://koenbeek.github.io/webtools/matchlist.html) - list certain RegExp matches
- [REplace](https://koenbeek.github.io/webtools/replace.html) - replace matched text

## XML/XPath tools

- [List XPath Matches](https://koenbeek.github.io/webtools/xpathlist.html) - find elements in an XML document
- [List Multi-XPath Matches](https://koenbeek.github.io/webtools/xpathslist.html) - extract data from XML using multiple XPaths

## Banking related tools

- [BBAN to IBAN](https://koenbeek.github.io/webtools/bban2iban.html) - convert BBAN list to IBAN list (no BBAN format checking)
- [exampleIBANs](https://koenbeek.github.io/webtools/exampleibans.html) - create list of example IBAN numbers (only a few supported countries)

## Example Uses

see [how some of these tools can be used in practice](Examples.md)

## Using the webtools locally without a web server

These webtools don't need/use the internet - everyting is done on the pc of the browser - the webserver only serves static html/js/css files

Ideally these webtools should be served via a webserver - If that's not possible and you can only access them via local access (file:// protocol) you can use the html files that don't use any js modules in the webtool**z** folder [here](https://github.com/koenbeek/koenbeek.github.io/tree/main/webtoolz) - else you'll get a CORS error message

another way to solve this CORS error is to launch chrome with command line option --allow-file-access-from-files (in windows: press "⊞-r" and type "chrome.exe --allow-file-access-from-files")


## Styling

These webtools have no styling - I'm not a UX guy and can't be bothered - if you have a css to use, you're welcome to [create a github issue](https://github.com/koenbeek/koenbeek.github.io/issues/new) and I'll include it in the repo
