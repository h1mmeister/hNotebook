import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

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
      wasmURL: "/esbuild.wasm",
    });
  };

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    // we are transpiling the code written in the text area
    const result = await ref.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });

    // setting the state for code here
    setCode(result.code);
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
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
