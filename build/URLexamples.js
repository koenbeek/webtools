var fs = require('fs')
var showdown = require('showdown')
const path = require('path')
const baseFilePath = path.join(__dirname, '..', 'docs', 'Examples.md')
const newFilePath = path.join(__dirname, '..', 'docs', 'webtools', '_Examples.html')
const dirPath = path.join(__dirname, '..', 'docs', 'webtools', 'examples')
let urlRE = new RegExp('https:\/\/koenbeek\\.github\\.io\/webtools\/([^.]+)\\.html\\?paramfile=examples\/([^.]+.json)', 'g')
let introRE = new RegExp('^# [\\s\\S]*?^##', 'gm')
var introTxt = `# Examples

These examples use URL parameters and should work even with file:// protocol 

##`

function replaceF(_, tool, example) {
  console.log(tool, example)
  let data = fs.readFileSync(path.join(dirPath, example), 'utf8')
  let params = JSON.parse(data);
  let p = {};
  Object.keys(params).forEach(e => { if (e[0] != "_") p[e] = params[e] })
  return './' + tool + '.html?' + new URLSearchParams(p).toString()
}

fs.readFile(baseFilePath, 'utf8', function (err, data) {
  if (err) { return console.log(err); }

  let result = data.replace(urlRE, replaceF)
  result = result.replace(introRE, introTxt)
  result = result.replace("https:\/\/koenbeek.github.io\/webtools", ".")

  let converter = new showdown.Converter()
  let html = converter.makeHtml(result)

  fs.writeFile(newFilePath, html, 'utf8', function (err) {
    if (err) return console.log(err);
  })
})