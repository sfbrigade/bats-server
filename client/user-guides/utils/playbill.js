const { chromium: targetBrowser } = require('@playwright/test');
const Playscript = require('./playscript');

module.exports = class Playbill {
  static print(...args) {
    return new Playbill(...args).print();
  }

  constructor({ name, script, context, browserOptions, options = {} }) {
    this.name = name;
    this.script = script;
    this.context = context;
    this.browserOptions = browserOptions;
    this.outputDir = options.outputDir ?? './build';
  }

  async print() {
    const browser = await targetBrowser.launch(this.browserOptions);
    const context = await browser.newContext(this.context);
    const page = await context.newPage();

    if (this.browserOptions?.timeout) {
      // passing a timeout into launch() doesn't seem to have any effect, so set it explicitly if one was passed in
      context.setDefaultTimeout(this.browserOptions.timeout);
    }

    await Playscript.perform({
      page,
      context,
      screenshots: { outputDir: this.outputDir, name: this.name },
      script: this.script,
    });

    await browser.close();
  }
};
