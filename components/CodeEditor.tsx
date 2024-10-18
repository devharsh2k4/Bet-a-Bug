import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => {
  return (
    <div className="h-full">
      <h2 className="text-xl font-bold mb-2">Code Editor</h2>
      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 16,
        }}
      />
    </div>
  );
};

export default CodeEditor;
