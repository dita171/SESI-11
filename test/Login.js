const { Builder, until } = require("selenium-webdriver");
const assert = require("assert");
const firefox = require("selenium-webdriver/firefox");
const fs = require("fs");
const path = require("path");
const LoginPage = require("./LoginPage"); 

describe("SauceDemo Login Automation with Visual Regression", function () {
    this.timeout(60000);
    let driver;
    let loginPage;

    async function takeScreenshot(driver, filename) {
        const screenshotDir = path.join(process.cwd(), "screenshots");
        
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        let image = await driver.takeScreenshot();
        fs.writeFileSync(path.join(screenshotDir, filename), image, "base64");
        console.log(`Visual screenshot disimpan secara aman di: /screenshots/${filename}`);
    }

    before(async function () {
        const options = new firefox.Options();
        options.addArguments("-headless");
        driver = await new Builder().forBrowser("firefox").setFirefoxOptions(options).build();
        loginPage = new LoginPage(driver); 
    });

    beforeEach(async function () {
        console.log("Starting a new test...");
        await loginPage.open(); 
    });

    it("Should login successfully with valid credentials", async function () {
        await loginPage.login("standard_user", "secret_sauce"); 
        
        await driver.wait(until.urlContains("inventory.html"), 10000);
        let currentUrl = await driver.getCurrentUrl();
        
        assert.ok(currentUrl.includes("inventory.html"), "Gagal masuk ke halaman dashboard/inventory");
        await takeScreenshot(driver, "positive_login_success.png");
    });

    it("Should fail to login with invalid username", async function () {
        await loginPage.login("invalid_user_99", "secret_sauce"); 
        
        let errorText = await loginPage.getErrorMessage(); 
        
        assert.ok(
            errorText.includes("Username and password do not match any user in this service"),
            "Pesan error salah/tidak sesuai untuk invalid username"
        );
        await takeScreenshot(driver, "negative_invalid_username.png");
    });

    afterEach(async function () {
        console.log("Test completed.");
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});