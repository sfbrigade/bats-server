//import path from "node:path";
//import process from "node:process";
import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import * as esbuild from "esbuild";

const SourceJSPattern = /\/src\/.*\.js$/;
const rollupPlugin = (matchers) => ({
  name: "js-in-jsx",
  load(id) {
    if (matchers.some(matcher => matcher.test(id))) {
      const file = fs.readFileSync(id, { encoding: "utf-8" });
      return esbuild.transformSync(file, { loader: "jsx" });
    }
  }
});

export default defineConfig({
  plugins: [
    svgr(),
    react()
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
      "uswds",
      "../shared/metadata"
    ],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: [SourceJSPattern],
    exclude: [],
  },
});



//export default defineConfig({
//  plugins: [
////    {
////      name: 'load-js-files-as-jsx',
////      async load(id) {
////        if (!id.match(/src\/.*\.js$/)) {
////          return;
////        }
////
////        const file = await fs.readFile(id, 'utf-8');
////        return esbuild.transformSync(file, { loader: 'jsx' });
////      },
////    },
//    react(),
//  ],
//  esbuild: {
//    loader: 'jsx',
//    include: /src\/.*\.js$/,
//    exclude: [],
//  },
//  optimizeDeps: {
//    esbuildOptions: {
//      plugins: [
//        {
//          name: "load-js-files-as-jsx",
//          setup(build) {
//            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
//              loader: "jsx",
//              contents: await fs.readFile(args.path, "utf8"),
//            }));
//          },
//        },
//      ],
//    },
////      loader: {
////        '.js': 'jsx',
////        '.ts': 'tsx',
////      },
//  },
////  root: "src",
////  publicDir: "../public",
////  build: {
////    outDir: "../dist"
////  },
////  resolve: {
////    alias: { "/src": path.resolve(process.cwd(), "src") }
////  },
//});


//const jsxInJs = {
//  build: {
//    rollupOptions: {
//      plugins: (matchers) => [rollupPlugin(matchers)],
//    },
//    commonjsOptions: {
//      transformMixedEsModules: true,
//    },
//  },
//  optimizeDeps: {
//    esbuildOptions: {
//      loader: {
//        '.js': 'jsx',
//      },
//    },
//  },
//};
