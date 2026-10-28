const { By, until } = require("selenium-webdriver");

class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.url = "https://saucedemo.com";
        this.usernameInput = By.id("user-name");
        this.passwordInput = By.id("password");
        this.loginButton = By.id("login-button");
        this.errorContainer = By.className("error-message-container");
    }

    async open() {
        await this.driver.get(this.url);
        await this.driver.wait(until.elementLocated(this.usernameInput), 35000);
    }

    async login(username, password) {
        await (await this.driver.findElement(this.usernameInput)).sendKeys(username);
        await (await this.driver.findElement(this.passwordInput)).sendKeys(password);
        await (await this.driver.findElement(this.loginButton)).click();
    }

    async getErrorMessage() {
        let errorEl = await this.driver.wait(until.elementLocated(this.errorContainer), 8000);
        return await errorEl.getText();
    }
}

module.exports = LoginPage;