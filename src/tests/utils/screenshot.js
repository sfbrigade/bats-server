class Screenshooter {
  constructor({ page, path }) {
    this.page = page;
    this.path = path;
  }

  screenshot(name) {
  	return this.page.screenshot({ path: `${this.path}/${name}.png`, fullPage: true });
  }
}

export function useScreenshot(options) {
	const shooter = new Screenshooter(options);

  return function screenshot(...args) {
  	return shooter.screenshot(...args);
  }
}
