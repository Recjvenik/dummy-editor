import React, { useState, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Subscript, Superscript, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon,
  Link as LinkIcon, Unlink, Table as TableIcon, Eraser, Minus, Video,
  Maximize, Minimize, Code, CodeXml, Printer, Terminal,
  Indent as IndentIcon, Outdent as OutdentIcon, FileText, Smile, Hash, Sigma,
  FileDown, Baseline, Highlighter, ListTodo, HelpCircle, CopyCheck, Check,
  UploadCloud
} from 'lucide-react';

const TipTapToolbar = ({
  editor, isFullScreen, toggleFullScreen, isHtmlMode, toggleHtmlMode,
  onGetPdf, onOpenEmoji, onOpenSpecialChar, onOpenTable, onOpenHelp
}) => {
  const [activeMenu, setActiveMenu] = useState(null); // 'link', 'image', 'video', 'file'
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'
  const [inputValue, setInputValue] = useState('');
  const [inputTitle, setInputTitle] = useState('');

  if (!editor) return null;

  const toggleMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
      setActiveTab(menu === 'link' || menu === 'video' ? 'url' : 'upload');
      setInputValue('');
      setInputTitle('');
      if (menu === 'link') {
        const previousUrl = editor.getAttributes('link').href || '';
        const { state } = editor;
        const { from, to } = state.selection;
        const selectedText = state.doc.textBetween(from, to, ' ');
        setInputValue(previousUrl);
        setInputTitle(selectedText);
      }
    }
  };

  const handleInsert = () => {
    if (!inputValue) return;
    if (activeMenu === 'link') {
      if (inputTitle && inputTitle !== editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' ')) {
        editor.chain().focus().insertContent(`<a href="${inputValue}" target="_blank">${inputTitle}</a>`).run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: inputValue, target: '_blank' }).run();
      }
    } else if (activeMenu === 'image') {
      editor.chain().focus().setImage({ src: inputValue }).run();
    } else if (activeMenu === 'video') {
      if (inputValue.includes('youtube') || inputValue.includes('youtu.be')) {
        editor.commands.setYoutubeVideo({ src: inputValue });
      } else {
        editor.chain().focus().insertContent(`<video controls src="${inputValue}" style="max-width: 100%"></video>`).run();
      }
    } else if (activeMenu === 'file') {
      const text = inputTitle || inputValue.split('/').pop();
      editor.chain().focus().insertContent(`<a href="${inputValue}" target="_blank">${text}</a>`).run();
    }
    setActiveMenu(null);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (type === 'image') {
        editor.chain().focus().setImage({ src: dataUrl }).run();
      } else if (type === 'video') {
        editor.chain().focus().insertContent(`<video controls src="${dataUrl}" style="max-width: 100%"></video>`).run();
      } else if (type === 'file') {
        editor.chain().focus().insertContent(`<a href="${dataUrl}" target="_blank" download="${file.name}">${file.name}</a>`).run();
      }
      setActiveMenu(null);
    };
    reader.readAsDataURL(file);
  };

  const printContent = useCallback(() => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;width:0;height:0;border:none;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write('<html><head><title>Print</title>');
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(s => s.outerHTML).join('');
    doc.write(styles);
    doc.write('<style>body{font-family:sans-serif;padding:20px;font-size:14px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px}</style>');
    doc.write('</head><body>');
    doc.write(editor.getHTML());
    doc.write('</body></html>');
    doc.close();
    setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); document.body.removeChild(iframe); }, 500);
  }, [editor]);

  return (
    <div className="tiptap-toolbar">

      {/* === ROW 1: Formatting, Fonts, Colors === */}
      <div className="tiptap-toolbar-row">
        {/* B I U S */}
        <div className="tiptap-toolbar-group">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} title="Bold">
            <Bold size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} title="Italic">
            <Italic size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''} title="Underline">
            <UnderlineIcon size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''} title="Strikethrough">
            <Strikethrough size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Font controls */}
        <div className="tiptap-toolbar-group">
          <select onChange={e => e.target.value ? editor.chain().focus().setFontFamily(e.target.value).run() : editor.chain().focus().unsetFontFamily().run()} value={editor.getAttributes('textStyle').fontFamily || ''} title="Font Family">
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times</option>
            <option value="Verdana">Verdana</option>
          </select>
          <select onChange={e => e.target.value ? editor.chain().focus().setFontSize(e.target.value).run() : editor.chain().focus().unsetFontSize().run()} value={editor.getAttributes('textStyle').fontSize || ''} title="Font Size" style={{ width: '50px' }}>
            <option value="">Size</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
            <option value="30px">30</option>
          </select>
          <select onChange={e => e.target.value ? editor.chain().focus().setLineHeight(e.target.value).run() : editor.chain().focus().unsetLineHeight().run()} value={editor.getAttributes('paragraph')?.lineHeight || editor.getAttributes('heading')?.lineHeight || ''} title="Line Height" style={{ width: '50px' }}>
            <option value="">LH</option>
            <option value="1">1</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
            <option value="2.5">2.5</option>
          </select>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Colors */}
        <div className="tiptap-toolbar-group">
          <label className="color-picker-wrapper" title="Text Color">
            <Baseline size={18} strokeWidth={1.75} />
            <div style={{ height: '3px', width: '14px', backgroundColor: editor.getAttributes('textStyle').color || '#000', position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)' }} />
            <input type="color" onInput={e => editor.chain().focus().setColor(e.target.value).run()} value={editor.getAttributes('textStyle').color || '#000000'} />
          </label>
          <label className="color-picker-wrapper" title="Background Color">
            <Highlighter size={18} strokeWidth={1.75} />
            <div style={{ height: '3px', width: '14px', backgroundColor: editor.getAttributes('highlight')?.color || '#ff0', position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)' }} />
            <input type="color" onInput={e => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} value={editor.getAttributes('highlight')?.color || '#ffff00'} />
          </label>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Clear */}
        <div className="tiptap-toolbar-group">
          <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
            <Eraser size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* === ROW 2: Layout & Paragraph === */}
      <div className="tiptap-toolbar-row">
        {/* Paragraph Format & Style */}
        <div className="tiptap-toolbar-group">
          <select onChange={e => { const v = e.target.value; v === 'p' ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: parseInt(v) }).run(); }} value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : editor.isActive('heading', { level: 4 }) ? '4' : 'p'} title="Paragraph Format">
            <option value="p">Normal</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>
          <select onChange={e => { const v = e.target.value; v ? editor.commands.setParagraphStyle(v) : editor.commands.unsetParagraphStyle(); }} value={editor.getAttributes('paragraph')?.class || ''} title="Paragraph Style">
            <option value="">Paragraph Style</option>
            <option value="fr-text-gray">Gray</option>
            <option value="fr-text-bordered">Bordered</option>
            <option value="fr-text-spaced">Spaced</option>
            <option value="fr-text-uppercase">Uppercase</option>
          </select>
          <select onChange={e => { 
            editor.commands.unsetInlineStyle(); 
            if (e.target.value) { editor.commands.setInlineStyle(e.target.value); } 
          }} value={editor.getAttributes('inlineStyle')?.class || ''} title="Inline Style">
            <option value="">Inline Style</option>
            <option value="fr-text-big-red">Big Red</option>
            <option value="fr-text-small-blue">Small Blue</option>
            <option value="fr-text-highlighted">Highlighted</option>
          </select>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Alignment */}
        <div className="tiptap-toolbar-group">
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''} title="Align Left">
            <AlignLeft size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''} title="Align Center">
            <AlignCenter size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''} title="Align Right">
            <AlignRight size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''} title="Justify">
            <AlignJustify size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Lists & Indent */}
        <div className="tiptap-toolbar-group">
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} title="Ordered List">
            <ListOrdered size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''} title="Bullet List">
            <List size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={editor.isActive('taskList') ? 'is-active' : ''} title="Task List">
            <ListTodo size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().outdent().run()} title="Decrease Indent">
            <OutdentIcon size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().indent().run()} title="Increase Indent">
            <IndentIcon size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Sub/Super, Code, Quote */}
        <div className="tiptap-toolbar-group">
          <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={editor.isActive('subscript') ? 'is-active' : ''} title="Subscript">
            <Subscript size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={editor.isActive('superscript') ? 'is-active' : ''} title="Superscript">
            <Superscript size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''} title="Quote">
            <Quote size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''} title="Code Block">
            <CodeXml size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''} title="Inline Code">
            <Terminal size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* === ROW 3: Insert & Tools === */}
      <div className="tiptap-toolbar-row">
        {/* Link, Media, File, Table */}
        <div className="tiptap-toolbar-group">
          
          <div style={{ position: 'relative', display: 'flex' }}>
            <button onClick={() => toggleMenu('link')} className={activeMenu === 'link' || editor.isActive('link') ? 'is-active' : ''} title="Insert Link">
              <LinkIcon size={18} strokeWidth={1.75} />
            </button>
            {activeMenu === 'link' && (
              <div className="tiptap-popover">
                <div className="tiptap-popover-header">
                  <div className="tiptap-popover-header-icon" style={{color: '#0098f7'}}><LinkIcon size={16} /></div>
                  <span style={{marginLeft: 8, fontSize: 13, fontWeight: 600}}>Insert Link</span>
                </div>
                <div className="tiptap-popover-body">
                  <input type="text" placeholder="URL..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} style={{ padding: '8px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '3px', outline: 'none', background: '#fff', color: '#333' }} autoFocus />
                  <input type="text" placeholder="Display text..." value={inputTitle} onChange={e => setInputTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} style={{ padding: '8px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '3px', outline: 'none', background: '#fff', color: '#333' }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <button onClick={handleInsert} style={{ background: 'transparent', color: '#0098f7', padding: '4px 8px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Insert</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Unlink">
            <Unlink size={18} strokeWidth={1.75} />
          </button>

          <div style={{ position: 'relative', display: 'flex' }}>
            <button onClick={() => toggleMenu('image')} className={activeMenu === 'image' ? 'is-active' : ''} title="Insert Image">
              <ImageIcon size={18} strokeWidth={1.75} />
            </button>
            {activeMenu === 'image' && (
              <div className="tiptap-popover">
                <div className="tiptap-popover-header" style={{ gap: 16 }}>
                  <button onClick={() => setActiveTab('upload')} style={{ background: 'transparent', border: 'none', color: activeTab === 'upload' ? '#0098f7' : '#999', cursor: 'pointer', padding: 0, width: 'auto', height: 'auto', display: 'flex' }} title="Upload Image">
                    <UploadCloud size={16} />
                  </button>
                  <button onClick={() => setActiveTab('url')} style={{ background: 'transparent', border: 'none', color: activeTab === 'url' ? '#0098f7' : '#999', cursor: 'pointer', padding: 0, width: 'auto', height: 'auto', display: 'flex' }} title="By URL">
                    <LinkIcon size={16} />
                  </button>
                </div>
                <div className="tiptap-popover-body">
                  {activeTab === 'upload' ? (
                    <div className="tiptap-dropzone">
                      Drop image<br/><small>(or click)</small>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                    </div>
                  ) : (
                    <>
                      <input type="text" placeholder="http://" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} style={{ padding: '8px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '3px', outline: 'none', background: '#fff', color: '#333' }} autoFocus />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                        <button onClick={handleInsert} style={{ background: 'transparent', color: '#0098f7', padding: '4px 8px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Insert</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative', display: 'flex' }}>
            <button onClick={() => toggleMenu('video')} className={activeMenu === 'video' ? 'is-active' : ''} title="Insert Video">
              <Video size={18} strokeWidth={1.75} />
            </button>
            {activeMenu === 'video' && (
              <div className="tiptap-popover">
                <div className="tiptap-popover-header" style={{ gap: 16 }}>
                  <button onClick={() => setActiveTab('url')} style={{ background: 'transparent', border: 'none', color: activeTab === 'url' ? '#0098f7' : '#999', cursor: 'pointer', padding: 0, width: 'auto', height: 'auto', display: 'flex' }} title="By URL">
                    <LinkIcon size={16} />
                  </button>
                  <button onClick={() => setActiveTab('upload')} style={{ background: 'transparent', border: 'none', color: activeTab === 'upload' ? '#0098f7' : '#999', cursor: 'pointer', padding: 0, width: 'auto', height: 'auto', display: 'flex' }} title="Upload Video">
                    <UploadCloud size={16} />
                  </button>
                </div>
                <div className="tiptap-popover-body">
                  {activeTab === 'upload' ? (
                    <div className="tiptap-dropzone">
                      Drop video<br/><small>(or click)</small>
                      <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                    </div>
                  ) : (
                    <>
                      <input type="text" placeholder="Paste in a video URL" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} style={{ padding: '8px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '3px', outline: 'none', background: '#fff', color: '#333' }} autoFocus />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <label style={{ fontSize: 13, color: '#333', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="checkbox" /> Autoplay
                        </label>
                        <button onClick={handleInsert} style={{ background: 'transparent', color: '#0098f7', padding: '4px 8px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Insert</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative', display: 'flex' }}>
            <button onClick={() => toggleMenu('file')} className={activeMenu === 'file' ? 'is-active' : ''} title="Upload File">
              <FileText size={18} strokeWidth={1.75} />
            </button>
            {activeMenu === 'file' && (
              <div className="tiptap-popover">
                <div className="tiptap-popover-header" style={{ gap: 16 }}>
                  <button onClick={() => setActiveTab('upload')} style={{ background: 'transparent', border: 'none', color: activeTab === 'upload' ? '#0098f7' : '#999', cursor: 'pointer', padding: 0, width: 'auto', height: 'auto', display: 'flex' }} title="Upload File">
                    <UploadCloud size={16} />
                  </button>
                  <button onClick={() => setActiveTab('url')} style={{ background: 'transparent', border: 'none', color: activeTab === 'url' ? '#0098f7' : '#999', cursor: 'pointer', padding: 0, width: 'auto', height: 'auto', display: 'flex' }} title="By URL">
                    <LinkIcon size={16} />
                  </button>
                </div>
                <div className="tiptap-popover-body">
                  {activeTab === 'upload' ? (
                    <div className="tiptap-dropzone">
                      Drop file<br/><small>(or click)</small>
                      <input type="file" onChange={(e) => handleFileUpload(e, 'file')} />
                    </div>
                  ) : (
                    <>
                      <input type="text" placeholder="URL..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} style={{ padding: '8px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '3px', outline: 'none', background: '#fff', color: '#333' }} autoFocus />
                      <input type="text" placeholder="Display text..." value={inputTitle} onChange={e => setInputTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} style={{ padding: '8px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '3px', outline: 'none', background: '#fff', color: '#333' }} />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                        <button onClick={handleInsert} style={{ background: 'transparent', color: '#0098f7', padding: '4px 8px', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Insert</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={onOpenTable} title="Insert Table">
            <TableIcon size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Emoji, Math, Special Char, HR */}
        <div className="tiptap-toolbar-group">
          <button onClick={onOpenEmoji} title="Emoticons">
            <Smile size={18} strokeWidth={1.75} />
          </button>
          <button onClick={onOpenSpecialChar} title="Special Characters">
            <Hash size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.commands.openMathLiveModal()} title="Math Equation">
            <Sigma size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line">
            <Minus size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Undo/Redo & Select All */}
        <div className="tiptap-toolbar-group">
          <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
            <Undo size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
            <Redo size={18} strokeWidth={1.75} />
          </button>
          <button onClick={() => editor.chain().focus().selectAll().run()} title="Select All">
            <CopyCheck size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="tiptap-toolbar-divider" />

        {/* Print / PDF / View / Help */}
        <div className="tiptap-toolbar-group">
          <button onClick={printContent} title="Print">
            <Printer size={18} strokeWidth={1.75} />
          </button>
          <button onClick={onGetPdf} title="Export PDF">
            <FileDown size={18} strokeWidth={1.75} />
          </button>
          <button onClick={toggleHtmlMode} className={isHtmlMode ? 'is-active' : ''} title="HTML Source">
            <Code size={18} strokeWidth={1.75} />
          </button>
          <button onClick={toggleFullScreen} title="Fullscreen">
            {isFullScreen ? <Minimize size={18} strokeWidth={1.75} /> : <Maximize size={18} strokeWidth={1.75} />}
          </button>
          <button onClick={onOpenHelp} title="Help">
            <HelpCircle size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>


      {/* Table controls row — only visible when table is active */}
      {editor.isActive('table') && (
        <div className="tiptap-toolbar-row" style={{ background: '#f9f9f9' }}>
          <div className="tiptap-toolbar-group">
            <button onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Before" style={{ fontSize: '11px', width: 'auto', padding: '0 8px' }}>+ Col</button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column" style={{ fontSize: '11px', width: 'auto', padding: '0 8px' }}>− Col</button>
            <button onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Before" style={{ fontSize: '11px', width: 'auto', padding: '0 8px' }}>+ Row</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row" style={{ fontSize: '11px', width: 'auto', padding: '0 8px' }}>− Row</button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table" style={{ fontSize: '11px', width: 'auto', padding: '0 8px', color: '#d00' }}>Delete Table</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TipTapToolbar;
