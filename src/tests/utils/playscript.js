import { ScreenShooter } from './screenshot';

const { isArray } = Array;
const isFunction = (value) => typeof value === 'function';
const isString = (value) => typeof value === 'string';

// eslint-disable-next-line import/prefer-default-export
export class Playscript {
  static perform(...args) {
    return new Playscript(...args).perform();
  }

  constructor({ page, screenshots, script }) {
    this.page = page;
    this.script = script;
    this.screenshooter  = new ScreenShooter({ page, ...screenshots });
    this.screenshot = (options) => this.screenshooter.take(options);
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

      return line({ page: this.page, screenshot: this.screenshot });
    }

    if (isString(line)) {
      if (line === 'screenshot') {
        console.log('screenshot()');

        return this.screenshot();
      }
    }

    throw new Error(`Found unreadable line: ${line}`);
  }
}
