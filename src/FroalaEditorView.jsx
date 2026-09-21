import { useState } from 'react';
import FroalaEditorModule from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import './froalaMathLivePlugin.js';

const FroalaEditor = FroalaEditorModule.default || FroalaEditorModule;

const ARTICLE_STORY_TOOLBAR_BUTTONS = [
  "bold",
  "italic",
  "underline",
  "strikeThrough",
  "subscript",
  "superscript",
  "textColor",
  "fontFamily",
  "fontSize",
  "inlineClass",
  "inlineStyle",
  "clearFormatting",
  "alignLeft",
  "alignCenter",
  "alignRight",
  "alignJustify",
  "formatOL",
  "formatUL",
  "paragraphFormat",
  "paragraphStyle",
  "outdent",
  "indent",
  "quote",
  "insertLink",
  "insertImage",
  "insertVideo",
  "insertTable",
  "emoticons",
  "specialCharacters",
  "insertFile",
  "insertHR",
  "insertMathEquation",
  "undo",
  "redo",
  "fullscreen",
  "print",
  "getPDF",
  "selectAll",
  "html",
  "help",
];

function FroalaEditorView() {
  const [content, setContent] = useState('<p>Hello Froala!</p>');

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <h1>Froala Editor Test</h1>
      <FroalaEditor
        tag="textarea"
        config={{
          key: 'your key',
          placeholderText: 'Type here...',
          toolbarButtons: ARTICLE_STORY_TOOLBAR_BUTTONS,
          imageUploadURL: 'http://localhost:5001/upload_image',
          fileUploadURL: 'http://localhost:5001/upload_file',
          imageUploadParam: 'file',
          fileUploadParam: 'file',
          fileAllowedTypes: ['*'],
        }}
        model={content}
        onModelChange={setContent}
      />
      <h2>Output HTML</h2>
      <pre style={{ background: '#f4f4f4', padding: 12, whiteSpace: 'pre-wrap' }}>
        {content}
      </pre>
    </div>
  );
}

export default FroalaEditorView;
