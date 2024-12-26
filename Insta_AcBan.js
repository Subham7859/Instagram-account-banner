const readline = require('readline');
const puppeteer = require('puppeteer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Instagram username: ', async (username) => {
  rl.question('Enter your Instagram password: ', async (password) => {
    rl.question('Enter the name of the account to be searched: ', async (accountName) => {

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      try {
        await page.goto('https://www.instagram.com', { waitUntil: 'networkidle2' });

        // Login to Instagram
        await page.waitForSelector('input[name="username"]', { visible: true });
        await page.type('input[name="username"]', username);
        await page.waitForSelector('input[name="password"]', { visible: true });
        await page.type('input[name="password"]', password);
        await page.keyboard.press('Enter');

        // Wait for the home page to load
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Search for the account
        await page.waitForSelector('input[aria-label="Search input"]');
        await page.type('input[aria-label="Search input"]', accountName);
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');

        // Wait for the account page to load and click on the account
        await page.waitForSelector(`a[href="/${accountName}/"]`);
        await page.click(`a[href="/${accountName}/"]`);

        console.log(`Navigated to the account: ${accountName}`);
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        // Keep the browser open for further interaction or close it
        // await browser.close();
        rl.close();
      }
    });
  });
});
