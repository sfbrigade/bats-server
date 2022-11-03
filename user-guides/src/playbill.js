// const { execSync } = require('child_process');
const { chromium: targetBrowser } = require('@playwright/test');

const Playscript = require('./playscript');
const { writeJSON } = require('./files');

// const execOptions = {
//   encoding: 'utf8',
// };

module.exports = class Playbill {
  static print(...args) {
    return new Playbill(...args).print();
  }

  constructor({ name, app, title = name, seeders = [], script, context, browserOptions, options = { outputDir: './build' } }) {
    this.name = name;
    this.app = app;
    this.title = title;
    this.seeders = seeders;
    this.script = script;
    this.context = context;
    this.browserOptions = browserOptions;
    this.outputDir = options.outputDir;
  }

  async print() {
    // set up the database with a known state on which to run this guide
    execSync(`docker compose exec server bash -l -c "npm --prefix user-guides run setup -- ${this.seeders.join(' ')}"`, execOptions);

    const browser = await targetBrowser.launch(this.browserOptions);
    const context = await browser.newContext(this.context);
    const page = await context.newPage();

    if (this.browserOptions?.timeout) {
      // passing a timeout into launch() doesn't seem to have any effect, so set it explicitly if one was passed in
      context.setDefaultTimeout(this.browserOptions.timeout);
    }

    const steps = await Playscript.perform({
      page,
      context,
      screenshots: { outputDir: this.outputDir, name: this.name },
      script: this.script,
    });

    await browser.close();
    await writeJSON([this.outputDir, this.name, 'metadata'], {
      title: this.title,
      name: this.name,
      buildTime: new Date().toISOString(),
      steps,
    });
  }
};
