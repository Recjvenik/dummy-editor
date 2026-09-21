import React, { useState, useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Highlight } from '@tiptap/extension-highlight';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import Youtube from '@tiptap/extension-youtube';
import * as html2pdfModule from 'html2pdf.js';
const html2pdf = html2pdfModule.default || html2pdfModule;
import { FontSize } from './extensions/FontSize';
import { Indent } from './extensions/Indent';
import { LineHeight } from './extensions/LineHeight';
import { ParagraphStyle } from './extensions/ParagraphStyle';
import { InlineStyle } from './extensions/InlineStyle';
import { MathLiveExtension } from './extensions/MathLiveExtension';

import TipTapToolbar from './TipTapToolbar';
import { EmojiModal, SpecialCharModal, TableModal, HelpModal } from './TipTapModals';
import './TipTapEditor.css';

const TipTapEditorView = () => {
  const [contentHTML, setContentHTML] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [showSpecialCharModal, setShowSpecialCharModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }).extend({
        addKeyboardShortcuts() {
          return {
            'Mod-k': () => {
              const previousUrl = this.editor.getAttributes('link').href || '';
              const { state } = this.editor;
              const { from, to } = state.selection;
              const selectedText = state.doc.textBetween(from, to, ' ');
              // Trigger the link modal via a custom event
              window.dispatchEvent(new CustomEvent('tiptap-open-link', { detail: { url: previousUrl, text: selectedText } }));
              return true;
            },
          };
        },
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: 'Type here...',
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        inline: false,
      }),
      FontSize,
      Indent,
      LineHeight,
      ParagraphStyle,
      InlineStyle,
      MathLiveExtension,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContentHTML(editor.getHTML());
      const text = editor.state.doc.textContent;
      setCharCount(text.length);
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    },
  });

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);
  const toggleHtmlMode = () => setIsHtmlMode(!isHtmlMode);

  // Remove the old link modal keyboard shortcut listener, or let TipTapToolbar handle it.
  // Actually, we can remove it because the inline toolbar doesn't use the modal.

  const handleGetPdf = () => {
    const element = document.createElement('div');
    element.innerHTML = contentHTML;
    element.style.padding = '20px';
    element.style.fontFamily = 'Inter, sans-serif';
    html2pdf().from(element).save('document.pdf');
  };

  return (
    <div className={`tiptap-container ${isFullScreen ? 'is-fullscreen' : ''}`}>
      {!isFullScreen && <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>TipTap Editor</h1>}
      <div className="tiptap-editor-wrapper">
        <TipTapToolbar
          editor={editor}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
          isHtmlMode={isHtmlMode}
          toggleHtmlMode={toggleHtmlMode}
          onGetPdf={handleGetPdf}
          onOpenEmoji={() => setShowEmojiModal(true)}
          onOpenSpecialChar={() => setShowSpecialCharModal(true)}
          onOpenTable={() => setShowTableModal(true)}
          onOpenHelp={() => setShowHelpModal(true)}
        />
        {isHtmlMode ? (
          <textarea
            className="tiptap-html-textarea"
            value={contentHTML}
            onChange={(e) => {
              setContentHTML(e.target.value);
              editor.commands.setContent(e.target.value);
            }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
        {/* Status Bar — Froala-style */}
        <div className="tiptap-status-bar">
          <div className="tiptap-status-bar-left">Powered by TipTap</div>
          <div className="tiptap-status-bar-right">
            <span>Words : {wordCount}</span>
            <span>Characters : {charCount}</span>
          </div>
        </div>
      </div>

      {!isFullScreen && (
        <>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginTop: '24px' }}>Output HTML</h2>
          <pre style={{ background: '#f5f5f5', padding: 12, whiteSpace: 'pre-wrap', borderRadius: 2, marginTop: 8, fontSize: '12px', border: '1px solid #ddd', color: '#333' }}>
            {contentHTML}
          </pre>
        </>
      )}

      {/* Modals */}
      <EmojiModal
        isOpen={showEmojiModal}
        onClose={() => setShowEmojiModal(false)}
        onSelect={(emoji) => { editor.chain().focus().insertContent(emoji).run(); setShowEmojiModal(false); }}
      />
      <SpecialCharModal
        isOpen={showSpecialCharModal}
        onClose={() => setShowSpecialCharModal(false)}
        onSelect={(char) => { editor.chain().focus().insertContent(char).run(); setShowSpecialCharModal(false); }}
      />
      <TableModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onSelect={(rows, cols) => { editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run(); setShowTableModal(false); }}
      />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default TipTapEditorView;
