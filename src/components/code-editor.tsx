import MonacoEditor from "@monaco-editor/react";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const onEditorDidMount = (getValue: () => string, monacoEditor: any) => {
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
  };

  return (
    <MonacoEditor
      editorDidMount={onEditorDidMount}
      value={initialValue}
      theme="dark"
      language="javascript"
      height="300px"
      options={{
        wordWrap: "on",
        minimap: { enabled: false },
        showUnused: false,
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
