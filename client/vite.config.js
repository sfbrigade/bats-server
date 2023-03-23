import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import * as esbuild from 'esbuild';

const SourceJSPattern = /\/src\/.*\.js$/;

// this plugin will force Vite to look for JSX in all .js files while building the production
// bundler, so we don't have to rename every single file
const rollupPlugin = (matchers) => ({
  name: 'js-in-jsx',
  load(id) {
    if (matchers.some((matcher) => matcher.test(id))) {
      const file = fs.readFileSync(id, { encoding: 'utf-8' });
      return esbuild.transformSync(file, { loader: 'jsx' });
    }
  },
});

// proxy these routes to the server running on port 4000.  this takes the place
// of setupProxy.js in webpack.
const proxy = ['/api', '/auth', '/libraries', '/wss'].reduce(
  (result, route) => ({
    ...result,
    [route]: {
      target: 'http://localhost:4000',
      changeOrigin: true,
      ws: true,
    },
  }),
  {}
);

export default defineConfig({
  server: {
    // vite defaults to an unused port, so force it to 3000
    port: 3000,
    // if port 3000 is being used, then quit (though it's not clear this actually works)
    strict: true,
    // no idea why this is necessary, but without it, the Vite dev server isn't reachable
    // from a browser on the host machine
    host: true,
    proxy,
  },
  plugins: [
    // raw SVG icons are imported in some places, so add a plugin so they get
    // wrapped in a React component like in webpack
    svgr(),
    react(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        rollupPlugin([SourceJSPattern])
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: [
      'uswds',
      'shared/constants',
      'shared/metadata'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    // point the JSX parser at all .js files, so we don't have to rename them all to .jsx
    loader: 'jsx',
    include: [SourceJSPattern],
    // we have to explicitly include this empty exclude key, for some reason
    exclude: [],
  },
});
