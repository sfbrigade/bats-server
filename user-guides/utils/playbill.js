const { chromium: targetBrowser } = require('@playwright/test');
const Playscript = require('./playscript');

module.exports = class Playbill {
  static print(...args) {
    return new Playbill(...args).print();
  }

  constructor({ name, script, context, options = {} }) {
    this.name = name;
    this.script = script;
    this.context = context;
    this.outputDir = options.outputDir ?? './build';
  }

  async print() {
    const browser = await targetBrowser.launch();
    const context = await browser.newContext(this.context);
    const page = await context.newPage();

    await Playscript.perform({
      page,
      screenshots: { outputDir: this.outputDir, name: this.name },
      script: this.script,
    });

    await browser.close();
  }
};
