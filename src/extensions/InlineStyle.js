import { Mark, mergeAttributes } from '@tiptap/core';

export const InlineStyle = Mark.create({
  name: 'inlineStyle',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {};
          }
          return { class: attributes.class };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[class]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setInlineStyle: (className) => ({ commands }) => {
        return commands.setMark(this.name, { class: className });
      },
      toggleInlineStyle: (className) => ({ commands }) => {
        return commands.toggleMark(this.name, { class: className });
      },
      unsetInlineStyle: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});
