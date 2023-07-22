const path = require('path')
const fs = require('fs')
const { By, Builder } = require("selenium-webdriver")
require("process")
require("chromedriver")

async function checkOtxt(params, file) {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:9001/" + params._tool + ".html?paramfile=examples/" + file);

  await new Promise(resolve => setTimeout(resolve, 1000)); // wait a second
  let element = driver.findElement(By.id("otxt"));
  let value = await element.getAttribute("value");

  if (params._otxt != value) {
    console.log("difference for", file);
    console.log("'" + params._otxt.replace(/\n/g, "\\n") + "'" + "\n<->\n" + "'" + value.replace(/\n/g, "\\n") + "'")
    process.exitCode = 1
  }
  await driver.quit();
}

async function testexamples() {
  const directoryPath = path.join(__dirname, '..', 'docs', 'webtools', 'examples')

  fs.readdir(directoryPath, function (err, files) {
    if (err) { console.log('Unable to scan directory: ' + err); return }
    files.forEach(file => {
      let params = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'webtools', 'examples', file)))
      checkOtxt(params, file)
    })
  })
}

process.setMaxListeners(50);
testexamples()
