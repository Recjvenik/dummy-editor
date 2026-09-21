import React, { useState } from 'react';
import './TipTapModals.css';

/* ========== Emoji Modal ========== */
export const EmojiModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const emojiGroups = {
    'Smileys': ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳'],
    'Emotions': ['😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓'],
    'Gestures': ['🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕'],
    'People': ['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏'],
  };

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content tiptap-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="tiptap-modal-header">
          <h3>Emoticons</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div className="tiptap-modal-body">
          {Object.entries(emojiGroups).map(([group, emojis]) => (
            <div key={group}>
              <div className="tiptap-modal-section-label">{group}</div>
              <div className="tiptap-modal-grid">
                {emojis.map((emoji, i) => (
                  <button key={i} onClick={() => onSelect(emoji)} className="tiptap-modal-grid-btn">{emoji}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========== Table Modal ========== */
export const TableModal = ({ isOpen, onClose, onSelect }) => {
  const [hovered, setHovered] = useState({ r: 0, c: 0 });
  if (!isOpen) return null;

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content" onClick={e => e.stopPropagation()} style={{ width: '280px' }}>
        <div className="tiptap-modal-header">
          <h3>Insert Table</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 18px)', gap: '2px' }} onMouseLeave={() => setHovered({ r: 0, c: 0 })}>
            {Array.from({ length: 10 }).map((_, r) =>
              Array.from({ length: 10 }).map((_, c) => (
                <div
                  key={`${r}-${c}`}
                  onMouseEnter={() => setHovered({ r: r + 1, c: c + 1 })}
                  onClick={() => { onSelect(hovered.r, hovered.c); setHovered({ r: 0, c: 0 }); }}
                  style={{ width: '18px', height: '18px', border: '1px solid #ccc', backgroundColor: r < hovered.r && c < hovered.c ? '#0098f7' : '#fff', cursor: 'pointer', borderRadius: '1px' }}
                />
              ))
            )}
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            {hovered.r > 0 && hovered.c > 0 ? `${hovered.r} × ${hovered.c}` : 'Select size'}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== Link Modal ========== */
export const LinkModal = ({ isOpen, onClose, onSelect, initialUrl, initialText }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);

  React.useEffect(() => {
    if (isOpen) { setUrl(initialUrl || ''); setText(initialText || ''); setOpenInNewTab(false); }
  }, [isOpen, initialUrl, initialText]);

  if (!isOpen) return null;

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content" onClick={e => e.stopPropagation()} style={{ width: '380px' }}>
        <div className="tiptap-modal-header">
          <h3>Insert Link</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div className="tiptap-modal-form">
          <div className="tiptap-modal-field">
            <label>URL</label>
            <input type="text" placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} autoFocus />
          </div>
          <div className="tiptap-modal-field">
            <label>Text</label>
            <input type="text" placeholder="Display text" value={text} onChange={e => setText(e.target.value)} />
          </div>
          <div className="tiptap-modal-checkbox">
            <input type="checkbox" id="link-new-tab" checked={openInNewTab} onChange={e => setOpenInNewTab(e.target.checked)} />
            <label htmlFor="link-new-tab">Open in new tab</label>
          </div>
          <div className="tiptap-modal-actions">
            <button className="tiptap-modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="tiptap-modal-btn-primary" onClick={() => { if (url) onSelect(url, text, openInNewTab); }}>Insert</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== Image Modal ========== */
export const ImageModal = ({ isOpen, onClose, onSelect }) => {
  const [url, setUrl] = useState('');
  React.useEffect(() => { if (isOpen) setUrl(''); }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content" onClick={e => e.stopPropagation()} style={{ width: '380px' }}>
        <div className="tiptap-modal-header">
          <h3>Insert Image</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div className="tiptap-modal-form">
          <div className="tiptap-modal-field">
            <label>Image URL</label>
            <input type="text" placeholder="https://example.com/image.png" value={url} onChange={e => setUrl(e.target.value)} autoFocus />
          </div>
          <div className="tiptap-modal-actions">
            <button className="tiptap-modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="tiptap-modal-btn-primary" onClick={() => { if (url) onSelect(url); }}>Insert</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== Video Modal ========== */
export const VideoModal = ({ isOpen, onClose, onSelect }) => {
  const [url, setUrl] = useState('');
  React.useEffect(() => { if (isOpen) setUrl(''); }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content" onClick={e => e.stopPropagation()} style={{ width: '380px' }}>
        <div className="tiptap-modal-header">
          <h3>Insert YouTube Video</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div className="tiptap-modal-form">
          <div className="tiptap-modal-field">
            <label>Video URL</label>
            <input type="text" placeholder="https://youtube.com/watch?v=..." value={url} onChange={e => setUrl(e.target.value)} autoFocus />
          </div>
          <div className="tiptap-modal-actions">
            <button className="tiptap-modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="tiptap-modal-btn-primary" onClick={() => { if (url) onSelect(url); }}>Insert</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== File Modal ========== */
export const FileModal = ({ isOpen, onClose, onSelect }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  React.useEffect(() => { if (isOpen) { setUrl(''); setText(''); } }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content" onClick={e => e.stopPropagation()} style={{ width: '380px' }}>
        <div className="tiptap-modal-header">
          <h3>Upload File</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div className="tiptap-modal-form">
          <div className="tiptap-modal-field">
            <label>File URL</label>
            <input type="text" placeholder="https://example.com/document.pdf" value={url} onChange={e => setUrl(e.target.value)} autoFocus />
          </div>
          <div className="tiptap-modal-field">
            <label>Display Text (Optional)</label>
            <input type="text" placeholder="Download Document" value={text} onChange={e => setText(e.target.value)} />
          </div>
          <div className="tiptap-modal-actions">
            <button className="tiptap-modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="tiptap-modal-btn-primary" onClick={() => { if (url) onSelect(url, text); }}>Insert</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== Special Characters Modal ========== */
export const SpecialCharModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const charGroups = {
    'Currency': ['€','£','¥','¢','₽','₹','$','₩','₫','₺'],
    'Symbols': ['©','®','™','℠','§','¶','†','‡','°','±','∞','≈','≠','≤','≥','×','÷','√','µ'],
    'Math': ['α','β','γ','δ','ε','θ','λ','π','σ','ω','Ω','∑','∫','∆','∇','∠','⊥','∥','∩','∪','⊂','⊃','⊆','⊇','∈','∉','∅','∴','∵'],
    'Arrows': ['←','↑','→','↓','↔','↕','⇐','⇑','⇒','⇓','⇔'],
    'Misc': ['✓','✗','★','☆','♡','♥','♪','♫','♠','♣','♦','•','◦','‣','…','—','–'],
  };

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content tiptap-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="tiptap-modal-header">
          <h3>Special Characters</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div className="tiptap-modal-body">
          {Object.entries(charGroups).map(([group, chars]) => (
            <div key={group}>
              <div className="tiptap-modal-section-label">{group}</div>
              <div className="tiptap-modal-grid">
                {chars.map((char, i) => (
                  <button key={i} onClick={() => onSelect(char)} className="tiptap-modal-grid-btn">{char}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========== Help Modal ========== */
export const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: '⌘ B', action: 'Bold' },
    { keys: '⌘ I', action: 'Italic' },
    { keys: '⌘ U', action: 'Underline' },
    { keys: '⌘ ⇧ X', action: 'Strikethrough' },
    { keys: '⌘ A', action: 'Select All' },
    { keys: '⌘ Z', action: 'Undo' },
    { keys: '⌘ ⇧ Z', action: 'Redo' },
    { keys: '⌘ K', action: 'Insert Link' },
    { keys: '⌘ ⇧ 7', action: 'Ordered List' },
    { keys: '⌘ ⇧ 8', action: 'Bullet List' },
    { keys: '⌘ ⇧ B', action: 'Blockquote' },
    { keys: '⌘ ⌥ C', action: 'Code Block' },
    { keys: 'Tab', action: 'Increase Indent' },
    { keys: '⇧ Tab', action: 'Decrease Indent' },
    { keys: '⇧ Enter', action: 'Hard Break (Line Break)' },
    { keys: '⌘ ⌥ 1', action: 'Heading 1' },
    { keys: '⌘ ⌥ 2', action: 'Heading 2' },
    { keys: '⌘ ⌥ 3', action: 'Heading 3' },
    { keys: '⌘ ⌥ 4', action: 'Heading 4' },
    { keys: '⌘ E', action: 'Inline Code' },
  ];

  return (
    <div className="tiptap-modal-overlay" onClick={onClose}>
      <div className="tiptap-modal-content" onClick={e => e.stopPropagation()} style={{ width: '420px' }}>
        <div className="tiptap-modal-header">
          <h3>Keyboard Shortcuts</h3>
          <button onClick={onClose} className="tiptap-modal-close">&times;</button>
        </div>
        <div className="tiptap-modal-body" style={{ padding: '0' }}>
          <table className="tiptap-help-table">
            <thead>
              <tr><th>Shortcut</th><th>Action</th></tr>
            </thead>
            <tbody>
              {shortcuts.map((s, i) => (
                <tr key={i}>
                  <td><kbd>{s.keys}</kbd></td>
                  <td>{s.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
