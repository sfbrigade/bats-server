// eslint-disable no-restricted-syntax
// eslint-disable no-await-in-loop
const { execSync } = require('child_process');
const ScreenShooter = require('./screenshot');

const { isArray } = Array;
const isFunction = (value) => typeof value === 'function';
const isString = (value) => typeof value === 'string';
const dockerExecCommand = (command) => `docker compose exec server bash -l -c "${command}"`;
const dockerSetupCommand = (seeders) => dockerExecCommand(`npm --prefix user-guides run setup -- ${[].concat(seeders).join(' ')}`);

const BoundMethods = ['screenshot', 'scrollToTop', 'exec', 'dockerExec', 'setup', 'step'];

module.exports = class Playscript {
  static perform(...args) {
    return new Playscript(...args).perform();
  }

  constructor({ page, screenshots, context, script }) {
    this.page = page;
    this.script = script;
    this.screenshooter = new ScreenShooter({ page, ...screenshots });
    this.context = context;
    this.steps = [];

    BoundMethods.forEach((method) => (this[method] = this[method].bind(this)));
  }

  async perform() {
    for (const line of this.script) {
      await this.read(line);
    }

    return this.steps;
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

    throw new Error(`Found unreadable line: ${line}`);
  }

  async scrollToTop(selector) {
    const headerHeight = await this.page.locator('.header').evaluate((node) => node.offsetHeight);
    const offsetTop = await this.page.locator(selector).evaluate((node) => node.offsetTop);

    // scroll the page to position the selected element below the header, with some margin.  we have to pass in the values via an argument
    // to the function, since it's evaluated in a different context outside of this closure.
    await this.page.evaluate(
      ({ offsetTop, headerHeight }) => {
        document.documentElement.scrollTop = offsetTop - (headerHeight + 10);
      },
      { offsetTop, headerHeight }
    );
  }

  screenshot(options, text) {
    let stepText = text;

    if (isString(options)) {
      stepText = options;
      // eslint-disable-next-line no-param-reassign
      options = undefined;
    }

    if (stepText) {
      this.step(stepText);
    }

    return this.screenshooter.take(options);
  }

  exec(command, options = { encoding: 'utf8' }) {
    return execSync(command, options);
  }

  dockerExec(command) {
    return this.exec(dockerExecCommand(command));
  }

  setup(seeders = []) {
    return this.exec(dockerSetupCommand(seeders));
  }

  step(text) {
    this.steps.push(text);
  }

  getFunctionArgs() {
    const entries = ['page', 'context', ...BoundMethods].map((name) => [name, this[name]]);

    return Object.fromEntries(entries);
  }
};
