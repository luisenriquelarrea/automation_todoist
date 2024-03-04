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
  try{
    await page.goto('https://trello.com/b/QvHVksDa/personal-work-goals');
  }catch(error){
    console.log(`An error occurred while navigating: ${error.message}`);
    process.exit();
  }

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  const taskSelector = "[data-list-id='55d39827b8629b45cb9c7231'] .NdQKKfeqJDDdX3"

  await page.waitForSelector(taskSelector)
    .then(() => console.log('got it'));

  // Pull a list of tasks from trello
  const tasks = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("[data-list-id='55d39827b8629b45cb9c7231'] .NdQKKfeqJDDdX3")
    const tasks = [];
    nodeList.forEach(function(node){
      tasks.push(node.innerHTML);
    })
    return tasks;
  })

  if(tasks.length === 0){
    console.log("There are no task.");
    await browser.close();
  }
  
  // Login into todoist
  try{
    await page.goto('https://app.todoist.com/auth/login');
  }catch(error){
    console.log(`An error occurred while navigating: ${error.message}`);
    process.exit();
  }
  await page.type('#element-0', props.email);
  await page.type('#element-3', props.password);
  await page.click("button[type=submit]");
  await page.waitForNavigation();

  await page.waitForSelector(".plus_add_button")
    .then(() => console.log('got it'));

  // Add list of tasks on todoist
  await page.click(".plus_add_button");
  for(let i = 0; i < tasks.length; i++){
    await page.type("[data-placeholder='Task name']", tasks[i]);
    await page.click("button[type=submit]");
  }

  // Display tasks
  await page.click("a[href='/app/project/inbox-2329602863']");
  
  await delay(2000)

  await browser.close();
})();

const delay = function (time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}