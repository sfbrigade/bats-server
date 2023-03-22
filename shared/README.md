# `shared` package

These files are shared by both the `client` and `server` packages. The `shared` package is written as a CommonJS module to make it easier to consume in the Node code of the `server` package. If the server code is rewritten to use ESM syntax, then the `shared` package can get updated as well.

If you want to make a change in the shared code and then test it the client or server, run `yarn upgrade shared` from the root `/app` directory in the docker instance. This should cause yarn to copy the latest files from the `shared` package to the root `/node_modules/shared/` directory that's used by the client and server.

If you're making lots of changes to `shared` and want to quickly test them, using [`yarn link`](https://classic.yarnpkg.com/lang/en/docs/cli/link/) may be easier.
