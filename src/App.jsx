import { Routes, Route, Link } from 'react-router-dom';
import FroalaEditorView from './FroalaEditorView';
import TipTapEditorView from './TipTapEditorView';
import './App.css';

function App() {
  return (
    <div>
      <nav style={{ padding: '20px', background: '#333', color: 'white', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Froala Editor</Link>
        <Link to="/tiptap" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>TipTap Editor</Link>
      </nav>
      <Routes>
        <Route path="/" element={<FroalaEditorView />} />
        <Route path="/tiptap" element={<TipTapEditorView />} />
      </Routes>
    </div>
  );
}

export default App;
