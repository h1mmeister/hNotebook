
import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "fileCache",
});

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // build.onResolve({ filter: /.*/ }, async (args: any) => {
      //   console.log("onResolve", args);

      //   if (args.path === "index.js") {
      //     return { path: args.path, namespace: "a" };
      //   }

      //   if (args.path.includes("./") || args.path.includes("../")) {
      //     return {
      //       namespace: "a",
      //       path: new URL(
      //         args.path,
      //         "https://unpkg.com" + args.resolveDir + "/"
      //       ).href,
      //     };
      //   }

      //   return {
      //     path: `https://unpkg.com/${args.path}`,
      //     namespace: "a",
      //   };
      // });

      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

    },
  };
};
