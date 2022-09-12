import { resolve } from 'path';

export class ScreenShooter {
  constructor({ page, outputDir = '', name = 'screenshot' }) {
    this.page = page;
    this.outputDir = outputDir;
    this.name = name;
    this.count = 0;
  }

  take(options = {}) {
    // eslint-disable-next-line no-plusplus
    this.count++;

    return this.page.screenshot({ path: this.getOutputFilePath(), fullPage: true, ...options });
  }

  getOutputFilePath() {
    return resolve(this.outputDir, `${this.name}-${this.count}.png`);
  }
}

export function useScreenshot(options) {
  const shooter = new ScreenShooter(options);

  return function screenshot(...args) {
    return shooter.take(...args);
  };
}
