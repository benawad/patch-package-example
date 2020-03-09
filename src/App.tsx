import React, { useMemo, useState } from "react";
import { createEditor, Node, Editor, Transforms } from "slate";
import { Editable, Slate, withReact, ReactEditor } from "slate-react";
import "./App.css";

const withWorkingPaste = (editor: Editor & ReactEditor) => {
  const { insertData } = editor;

  editor.insertData = data => {
    const text = data.getData("text/plain");
    if (text) {
      let i = 0;
      for (const line of text.split(/\r\n|\r|\n/)) {
        if (!i) {
          Transforms.insertText(editor, line);
        } else {
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: line }]
          });
        }
        i++;
      }
      return;
    }

    insertData(data);
  };

  return editor;
};

function App() {
  const editor = useMemo(() => withWorkingPaste(withReact(createEditor())), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "I am sentence number one." }]
    },
    {
      type: "paragraph",
      children: [{ text: "And I am sentence number 2." }]
    }
  ]);
  // Render the Slate context.
  return (
    <div className="App">
      <header className="App-header">
        <Slate
          editor={editor}
          value={value}
          onChange={value => setValue(value)}
        >
          <Editable
            style={{
              backgroundColor: "#fafafa",
              color: "#444",
              padding: 20,
              minHeight: 200,
              minWidth: 400
            }}
          />
        </Slate>
      </header>
    </div>
  );
}

export default App;
