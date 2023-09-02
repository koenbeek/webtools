const path = require('path')
const fs = require('fs')
const { By, Builder, until } = require("selenium-webdriver")
require("process")
require("chromedriver")

async function checkResult(params, file) {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:9001/tools.html?paramfile=examples/" + file);

  await driver.wait(until.elementLocated(By.id('txt1')), 10000);

  await new Promise(resolve => setTimeout(resolve, 1000)); // wait a second

  /*
  Object.keys(params).filter((k) => { return k[0] == "_" }).forEach(async (r) => {
    let res = r.slice(1)
    let element = driver.findElement(By.id(res));
    let value = await element.getAttribute("value");

    if (params[r] != value) {
      console.log("difference for", file);
      console.log("'" + params[r].replace(/\n/g, "\\n") + "'" + "\n<->\n" + "'" + value.replace(/\n/g, "\\n") + "'")
      process.exitCode = 1
    } else {
      console.log(file, "OK");
    }
  })
  */ //Todo: handle other results than txt1 -> could be txt2 or higher

  let element = driver.findElement(By.id("txt1"));
  let value = await element.getAttribute("value");

  if (params._txt1 != value) {
    console.log("difference for", file);
    console.log("'" + params._txt1.replace(/\n/g, "\\n") + "'" + "\n<->\n" + "'" + value.replace(/\n/g, "\\n") + "'")
    process.exitCode = 1
  } else {
    console.log(file, "OK");
  }

  await driver.quit();
}

async function testexamples() {
  const directoryPath = path.join(__dirname, '..', 'docs', 'webtools', 'examples')

  fs.readdir(directoryPath, function (err, files) {
    if (err) { console.log('Unable to scan directory: ' + err); return }
    files.forEach(file => {
      let params = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'webtools', 'examples', file)))
      checkResult(params, file)
    })
  })
}

process.setMaxListeners(50);
testexamples()
