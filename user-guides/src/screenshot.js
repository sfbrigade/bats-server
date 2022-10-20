const { join } = require('path');

module.exports = class ScreenShooter {
  constructor({ page, outputDir = '', name = 'screenshot' }) {
    this.page = page;
    this.outputDir = outputDir;
    this.name = name;
    this.count = 0;
  }

  take(options = {}) {
    const { selector, ...screenshotOptions } = options;
    const target = selector ? this.page.locator(selector) : this.page;

    // eslint-disable-next-line no-plusplus
    this.count++;

    return target.screenshot({ path: this.getOutputFilePath(), ...screenshotOptions });
  }

  getOutputDirPath() {
    return join(this.outputDir, this.name);
  }

  getOutputFilePath() {
    return join(this.getOutputDirPath(), `${this.name}-${this.count}.png`);
  }
};
