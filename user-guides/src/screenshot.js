const { join } = require('path');

module.exports = class ScreenShooter {
  constructor({ page, outputDir = '', name = 'screenshot' }) {
    this.page = page;
    this.outputDir = outputDir;
    this.name = name;
    this.count = 0;
  }

  take(options = {}) {
    // eslint-disable-next-line no-plusplus
    this.count++;

    return this.page.screenshot({ path: this.getOutputFilePath(), ...options });
  }

  getOutputDirPath() {
    return join(this.outputDir, this.name);
  }

  getOutputFilePath() {
    return join(this.getOutputDirPath(), `${this.name}-${this.count}.png`);
  }
};
