const puppeteer = require('puppeteer');
const props = require('./app_properties');

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://trello.com/b/QvHVksDa/personal-work-goals');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  const taskSelector = "[data-list-id='55d39827b8629b45cb9c7231'] .NdQKKfeqJDDdX3"

  await page.waitForSelector(taskSelector)
    .then(() => console.log('got it'));

  const tasks = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("[data-list-id='55d39827b8629b45cb9c7231'] .NdQKKfeqJDDdX3")
    const tasks = [];
    nodeList.forEach(function(item){
        tasks.push(item.innerHTML)
    })
    return tasks
  })
  
  await page.goto('https://app.todoist.com/auth/login');
  await page.type('#element-0', props.email);
  await page.type('#element-3', props.password);
  await page.click("button[type=submit]");
  await page.waitForNavigation();

  await page.waitForSelector(".plus_add_button")
    .then(() => console.log('got it'));

  await page.click(".plus_add_button");
  for(let i = 0; i < tasks.length; i++){
    await page.type("[data-placeholder='Task name']", tasks[i]);
    await page.click("button[type=submit]");
  }
  
  await delay(1000)

  await browser.close();
})();

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}