var puppeteer = require('puppeteer');

async function test() {
  //var val = data[0]

  var browser = await puppeteer.launch(
    {
      headless: false,
      slowMo: 200,
      defaultViewport: { width: 1033, height: 768} 
    }
  )
  var page = await browser.newPage();
  await page.goto("http://localhost:3000");
  await page.click('#navbarSupportedContent > div > button');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#navbarSupportedContent > div > div > a')
  ])

  await page.$eval('input[name=first_name]', el => el.value = 'Kit Jonathan');
  await page.$eval('input[name=last_name]', el => el.value = 'Te');
  await page.$eval('#validationCustom03', el => el.value = 'xxx@x.com');
  await page.$eval('input[name=password_hash]', el => el.value = 'x');
  await page.$eval('#confirmPassword', el => el.value = 'x');
  await page.click('#invalidCheck');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#signup-btn')
  ])
  
  await page.$eval('#validationCustom04', el => el.value = 'kjonathante');
  await page.$eval('#validationCustom05', el => el.value = 'kjonathante');
  await Promise.all([
    page.waitForSelector('#github-selection'),
    page.click('#repo-btn')
  ])

  await page.waitForSelector('#github-selection > div:nth-child(8) > input')
  await page.click('#github-selection > div:nth-child(8) > input')
  await page.click('#github-selection > div:nth-child(11) > input')
  

  var fileupload = await page.$('#pic-upload')
  fileupload.uploadFile('app/public/assets/imgs/profilepic.png')
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#update-btn')
  ])
  

  //, el => el.value = '/Users/kitjonathante/Downloads/Adriana\ Photos/SAM_3187.JPG');
  
  
  await page.waitFor(2000)
  
  await browser.close();

}

// const [response] = await Promise.all([
//   page.waitForNavigation(waitOptions),
//   page.click(selector, clickOptions),
// ]);
test()