# Webtools

## Basic text tools

- [Lines To List](webtools/lines2list.html) - join data on several lines into 1 line with seperators
- [Sort Lines](webtools/sort.html) - sort lines

## Regular expression text tools

- [Grep](webtools/grep.html) - find lines containing some text pattern
- [Match List](webtools/matchlist.html) - list certain matches
- [REplace](webtools/replace.html) - replace matched text

## Banking related tools

- [BBAN to IBAN](webtools/bban2iban.html) - convert BBAN list to IBAN list (no BBAN format checking)
- [exampleIBANs](webtools/exampleIBANs.html) - create list of example IBAN numbers (only BE and FR for now)

## Using the webtools locally without a web server

you may get a CORS error message when accessing the html pages with file:// protocol - i.e. without a web server

one way to solve this is to launch chrome with command line option --allow-file-access-from-files

if possible use a webserver - with python 3 you can start one with "python3 -m http.server" in the webtools folder

## styling

These webtools have no styling - I'm not a UX guy and can't be bothered - if you have a good css to use, create an issue or a pull request and I'll include it :-)
