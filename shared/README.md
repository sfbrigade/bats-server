# `shared` package

These files are shared by both the `client` and `server` packages. The `shared` package is written as a CommonJS module to make it easier to consume in the Node code of the `server` package. If the server code is rewritten to use ESM syntax, then the `shared` package can get updated as well.

If you want to make a change in the shared code and then test it the client or server, run `yarn upgrade shared` from the root `/app` directory in the docker instance. This should cause yarn to copy the latest files from the `shared` package to the root `/node_modules/shared/` directory that's used by the client and server.

If you're making lots of changes to `shared` and want to quickly test them, using [`yarn link`](https://classic.yarnpkg.com/lang/en/docs/cli/link/) may be easier.

## Using `*` instead of `file:../shared` doesn't work

In theory, you should be able to add the `shared` package to others in the monorepo by adding `"shared": "*"` to their `package.json` files. This would link the package, so that any changes to `shared` would immediately be available in the other packages.

But using `*` instead of `file:../shared` causes a Rollup error during the build: `RollupError: "DeliveryStatus" is not exported by "../shared/constants/index.js", imported by "src/Models/Ringdown.js".`

This seems to be related to the fact that the `shared` package is in CJS format and has to get optimized during the dev serving process, thanks to the `optimizeDeps.include` array in the Vite config. But that during doesn't work during build, and various attempts at changing the `build.commonjsOptions` flags haven't worked. It also seems to be related to [this Vite bug](https://github.com/vitejs/vite/issues/2679).

So it seems simplest to use the `file:` format for specifying the version of `shared` for now, until it can get rewritten as an ES module. (Also note that you have to re-run yarn after making changes to the package.json file; otherwise things may look like they're working, even though they won't during CI/CD.)
