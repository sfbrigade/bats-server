const { join } = require('path');
const { chromium: targetBrowser } = require('@playwright/test');

const Playscript = require('./playscript');
const { writeJSON } = require('./files');

module.exports = class Playbill {
  static print(...args) {
    return new Playbill(...args).print();
  }

  constructor({ name, app, title = name, script, context, browserOptions, options = {} }) {
    this.name = name;
    this.app = app;
    this.title = title;
    this.script = script;
    this.context = context;
    this.browserOptions = browserOptions;
    this.outputDir = join(options.outputDir ?? './build', app);
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
    await writeJSON([this.outputDir, this.name, 'metadata'], {
      title: this.title,
      name: this.name,
      buildTime: new Date().toISOString()
    });
  }
};
