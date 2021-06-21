import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "fileCache",
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: "fetch-plugin",
        setup(build: esbuild.PluginBuild) {
        build.onLoad({ filter: /.*/ }, async (args: any) => {
            // console.log("onLoad", args);
    
            if (args.path === "index.js") {
              return {
                loader: "jsx",
                contents: inputCode,
              };
            }
    
            // check to see if we have already fetched this file and if it is in the cache
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
              args.path
            );
    
            if (cachedResult) {
              return cachedResult;
            }
    
            const { data, request } = await axios.get(args.path);
            const result: esbuild.OnLoadResult = {
              loader: "jsx",
              contents: data,
              resolveDir: new URL("./", request.responseURL).pathname,
            };
    
            // store response in cache
            await fileCache.setItem(args.path, result);
            return result;
          });
            
        }
    }
}