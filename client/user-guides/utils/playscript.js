const ScreenShooter = require('./screenshot');

const { isArray } = Array;
const isFunction = (value) => typeof value === 'function';
const isString = (value) => typeof value === 'string';

module.exports = class Playscript {
  static perform(...args) {
    return new Playscript(...args).perform();
  }

  constructor({ page, screenshots, context, script }) {
    this.page = page;
    this.script = script;
    this.screenshooter  = new ScreenShooter({ page, ...screenshots });
    this.context = context;

    this.screenshot = (options) => this.screenshooter.take(options);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  async perform() {
    // eslint-disable-next-line no-restricted-syntax
    for (const line of this.script) {
      // eslint-disable-next-line no-await-in-loop
      await this.read(line);
    }
  }

  async read(line) {
    if (isArray(line)) {
      const [selector, command] = line;
      let args;
      let method;

      if (isArray(selector)) {
        [method, ...args] = selector;
        console.log(`page.${method}(${args})`);

        return this.page[method](...args);
      }

      if (isArray(command)) {
        [method, ...args] = command;
      } else {
        // the default method is fill(), which requires a string argument
        method = 'fill';
        args = [String(command)];
      }

      console.log(`page.locator(${selector}).${method}(${args})`);

      return this.page.locator(selector)[method](...args);
    }

    if (isFunction(line)) {
      console.log(String(line).replace(/^.+=> /s, ''));

      return line(this.getFunctionArgs());
    }

    if (isString(line)) {
      if (line === 'screenshot') {
        console.log('screenshot()');

        return this.screenshot();
      }
    }

    throw new Error(`Found unreadable line: ${line}`);
  }

  async scrollToTop(selector) {
    const headerHeight = (await this.page.locator('.header').evaluate((node) => node.offsetHeight));
    const offsetTop = (await this.page.locator(selector).evaluate((node) => node.offsetTop));

    // scroll the page to position the selected element below the header, with some margin.  we have to pass in the values via an argument
    // to the function, since it's evaluated in a different context outside of this closure.
    await this.page.evaluate(({ offsetTop, headerHeight }) => {
      document.documentElement.scrollTop = offsetTop - (headerHeight + 10);
    }, { offsetTop, headerHeight });
  }

  getFunctionArgs() {
    return {
      page: this.page,
      screenshot: this.screenshot,
      context: this.context,
      scrollToTop: this.scrollToTop,
    };
  }
};
