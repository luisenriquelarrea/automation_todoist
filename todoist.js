const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 400
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://trello.com/b/QvHVksDa/personal-work-goals');

  const taskSelector = "[data-list-id='55d39827b8629b45cb9c7231'] .NdQKKfeqJDDdX3"

  await page.waitForSelector(taskSelector)
    .then(() => console.log('got it'));

  const result = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("[data-list-id='55d39827b8629b45cb9c7231'] .NdQKKfeqJDDdX3")
    const tasks = [];
    nodeList.forEach(function(item){
        tasks.push(item.innerHTML)
    })
    return tasks
  })
  
  console.log(result)
  
  await browser.close();
})();