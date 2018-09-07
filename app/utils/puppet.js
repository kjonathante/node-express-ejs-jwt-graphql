var path = require('path')
var puppeteer = require('puppeteer');

exports.screenshot = async function(data, callback) {
  //var val = data[0]

  var browser = await puppeteer.launch({defaultViewport: { width: 1033, height: 768} });
  var page = await browser.newPage();
  for (var val of data) {
    var response = await page.goto(val.url);
    console.log('Inside puppet --> response', response.status)
    await page.screenshot({path: path.join(__dirname, '../public/images/')+val.filename});  
  }
  await browser.close();
  callback()
}


exports.screenshot2 = async function(data, callback) {
  //var val = data[0]

  var browser = await puppeteer.launch({defaultViewport: { width: 1033, height: 768} });
  var page = await browser.newPage();
  for (var i in data) {
    var response = await page.goto(data[i][4]);
    if (response._status == 200) {
      await page.screenshot({path: path.join(__dirname, '../public/images/')+data[i][5]})
      data[i][6] = 200
    } else {
      data[i][5] = '404/404.png'
    }
  }
  await browser.close();
  callback(null, data)
}