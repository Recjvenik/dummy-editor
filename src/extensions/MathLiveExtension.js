import { Node, mergeAttributes } from '@tiptap/core';
import { convertLatexToMarkup } from 'mathlive';
import 'mathlive';
import 'mathlive/fonts.css';
import 'mathlive/static.css';
import '../froalaMathLivePlugin.css';

export const MathLiveExtension = Node.create({
  name: 'mathlive',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: element => element.getAttribute('data-latex'),
        renderHTML: attributes => {
          return {
            'data-latex': attributes.latex,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span.fr-mathlive-formula',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const span = document.createElement('span');
    span.className = 'fr-mathlive-formula';
    span.contentEditable = 'false';
    const latex = HTMLAttributes['data-latex'] || HTMLAttributes.latex || '';
    span.setAttribute('data-latex', latex);
    
    // Inject the fully rendered MathLive markup into the exported HTML
    span.innerHTML = convertLatexToMarkup(latex);
    
    // Tiptap allows returning an actual DOM Node from renderHTML
    return span;
  },
  
  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const dom = document.createElement('span');
      dom.className = 'fr-mathlive-formula';
      dom.contentEditable = 'false';
      dom.setAttribute('data-latex', node.attrs.latex);
      dom.innerHTML = convertLatexToMarkup(node.attrs.latex);
      return {
        dom,
      };
    };
  },

  addCommands() {
    return {
      insertMathEquation: (latex) => ({ chain }) => {
        return chain().insertContent({
          type: this.name,
          attrs: {
            latex,
          },
        }).run();
      },
      openMathLiveModal: () => ({ editor }) => {
        const overlay = document.createElement('div');
        overlay.className = 'fr-mathlive-overlay';
        
        const panel = document.createElement('div');
        panel.className = 'fr-mathlive-panel';
        
        const heading = document.createElement('div');
        heading.className = 'fr-mathlive-heading';
        heading.textContent = 'Insert math equation';
        
        const mathField = document.createElement('math-field');
        mathField.className = 'fr-mathlive-field';
        mathField.setAttribute('virtual-keyboard-mode', 'onfocus');
        
        // If the user is currently selecting an existing math node, we could populate it,
        // but for now, we just do a simple insert.
        
        const actions = document.createElement('div');
        actions.className = 'fr-mathlive-actions';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'fr-mathlive-btn fr-mathlive-btn-cancel';
        
        const insertBtn = document.createElement('button');
        insertBtn.type = 'button';
        insertBtn.textContent = 'Insert';
        insertBtn.className = 'fr-mathlive-btn fr-mathlive-btn-insert';
        
        actions.append(cancelBtn, insertBtn);
        panel.append(heading, mathField, actions);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        
        mathField.focus();
        
        function close() {
          document.body.removeChild(overlay);
        }
        
        function cancel() {
          editor.commands.focus();
          close();
        }
        
        cancelBtn.addEventListener('click', cancel);
        
        overlay.addEventListener('click', (evt) => {
          if (evt.target === overlay) cancel();
        });
        
        insertBtn.addEventListener('click', () => {
          const latex = mathField.value.trim();
          close();
          
          if (!latex) {
            editor.commands.focus();
            return;
          }
          
          editor.commands.insertMathEquation(latex);
          editor.commands.focus();
        });
        
        return true;
      },
    };
  },
});
