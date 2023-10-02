const path = require('path')
const fs = require('fs')
const { By, Builder, until } = require("selenium-webdriver")
require("process")
require("chromedriver")
process.setMaxListeners(50);

async function checkVar(driver, res, params, file) {
  let element = driver.findElement(By.id(res))
  let value = await element.getAttribute("value")

  if (params['_' + res] != value) {
    console.log("difference for", file)
    console.log("'" + params['_' + res].replace(/\n/g, "\\n") + "'" + "\n<->\n" + "'" + value.replace(/\n/g, "\\n") + "'")
    return false
  } else {
    return true
  }
}

async function checkResult(params, file) {
  let driver = await new Builder().forBrowser("chrome").build()
  let testvars = []
  try {
    await driver.get("http://localhost:9001/tools.html?paramfile=examples/" + file)
    await driver.wait(until.elementLocated(By.id('txt1')), 10000)
    await new Promise(resolve => setTimeout(resolve, 1000)) // wait an extra second
    Object.keys(params).filter((k) => { return (k[0] == "_") }).forEach((r) => testvars.push(r.slice(1)))
    let OK = true;
    for (res of testvars) { OK = await checkVar(driver, res, params, file) && OK }
    OK ? console.log(file, 'OK') : process.exitCode = 1
  } finally {
    await driver.quit()
  }
}

(async function testexamples() {
  const directoryPath = path.join(__dirname, '..', 'docs', 'webtools', 'examples')

  fs.readdir(directoryPath, function (err, files) {
    if (err) { console.log('Unable to scan directory: ' + err); return }
    files.forEach(file => {
      let params = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'webtools', 'examples', file)))
      checkResult(params, file)
    })
  })
})()