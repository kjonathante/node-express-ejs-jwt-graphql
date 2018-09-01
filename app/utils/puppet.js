var path = require('path')
var puppeteer = require('puppeteer');

exports.screenshot = async function(data, callback) {
  //var val = data[0]

  var browser = await puppeteer.launch({defaultViewport: { width: 1033, height: 768} });
  var page = await browser.newPage();
  for (var val of data) {
    await page.goto(val.url);
    await page.screenshot({path: path.join(__dirname, '../public/images/')+val.filename});  
  }
  await browser.close();
  callback()
}