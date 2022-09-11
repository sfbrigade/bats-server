import { resolve } from 'path';

class ScreenShooter {
  constructor({ page, outputDir = '', name = 'screenshot' }) {
    this.page = page;
    this.outputDir = outputDir;
    this.name = name;
    this.count = 0;
  }

  takeScreenshot() {
    // eslint-disable-next-line no-plusplus
    this.count++;

    return this.page.screenshot({ path: this.getOutputFilePath(), fullPage: true });
  }

  getOutputFilePath() {
    return resolve(this.outputDir, `${this.name}-${this.count}.png`);
  }
}

export default function useScreenshot(options) {
  const shooter = new ScreenShooter(options);

  return function screenshot(...args) {
    return shooter.takeScreenshot(...args);
  };
}
