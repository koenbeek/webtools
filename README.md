# Webtools

## Basic text tools

- [Lines To List](webtools/lines2list.html) - join data on several lines into 1 line with seperators
- [Sort Lines](webtools/sort.html) - sort lines

## Regular expression text tools

- [Grep](webtools/grep.html) - find lines containing some text pattern
- [List RE Matches](webtools/matchlist.html) - list certain RegExp matches
- [REplace](webtools/replace.html) - replace matched text

## XML/XPath tools

- [List XPath Matches](webtools/xpathlist.html) - find elements in an XML document
- [List Multi-XPath Matches](webtools/xpathslist.html) - extract data from XML using multiple XPaths

## Banking related tools

- [BBAN to IBAN](webtools/bban2iban.html) - convert BBAN list to IBAN list (no BBAN format checking)
- [exampleIBANs](webtools/exampleibans.html) - create list of example IBAN numbers (only a few supported countries)

## Example Uses

see [how some of these tools can be used in practice](Examples.md)

## Using the webtools locally without a web server

you'll get a CORS error message when accessing the html pages with file:// protocol - i.e. without a web server

one way to solve this is to launch chrome with command line option --allow-file-access-from-files (in windows: press "⊞-r" and type "chrome.exe --allow-file-access-from-files")

if possible use a webserver - with python 3 you can start one with "python3 -m http.server" in the webtools folder

## Styling

These webtools have no styling - I'm not a UX guy and can't be bothered - if you have a css to use, you're welcome to [create a github issue](https://github.com/koenbeek/koenbeek.github.io/issues/new) and I'll include it in the repo
