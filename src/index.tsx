/* eslint-disable jsx-a11y/iframe-has-title */
import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const ref = useRef<any>();

  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  // use useEffect to call startService only one time
  useEffect(() => {
    startService();
  }, []);

  // initializing to use esbuild-wasm binary
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    // we are bundling the code written in the text area now
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    // setting the state for code here
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe sandbox="" src="/test.html" />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
