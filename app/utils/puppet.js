var path = require('path')
var puppeteer = require('puppeteer');

exports.screenshot = async function(url, filename) {
  var browser = await puppeteer.launch();
  var page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({path: path.join(__dirname, '../public/images/')+filename+'.png'});

  await browser.close();
}