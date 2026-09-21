import { Extension } from '@tiptap/core';

export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote'],
      minLevel: 0,
      maxLevel: 8,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: element => {
              const paddingLeft = element.style.marginLeft || element.style.paddingLeft;
              return paddingLeft ? parseInt(paddingLeft, 10) / 20 : 0;
            },
            renderHTML: attributes => {
              if (!attributes.indent) {
                return {};
              }

              return {
                style: `margin-left: ${attributes.indent * 20}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        tr = tr.setSelection(selection);
        tr = this.options.types.reduce((transaction, type) => {
          return transaction.setNodeMarkup(selection.from, null, {
            indent: Math.min((selection.$from.parent.attrs.indent || 0) + 1, this.options.maxLevel),
          });
        }, tr);
        
        const { from, to } = selection;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const indent = (node.attrs.indent || 0) + 1;
            if (indent <= this.options.maxLevel) {
              tr = tr.setNodeMarkup(pos, null, { ...node.attrs, indent });
            }
          }
        });

        if (dispatch) {
          dispatch(tr);
        }
        return true;
      },
      outdent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        tr = tr.setSelection(selection);
        
        const { from, to } = selection;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const indent = (node.attrs.indent || 0) - 1;
            if (indent >= this.options.minLevel) {
              tr = tr.setNodeMarkup(pos, null, { ...node.attrs, indent });
            }
          }
        });

        if (dispatch) {
          dispatch(tr);
        }
        return true;
      },
    };
  },
  
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    };
  },
});
