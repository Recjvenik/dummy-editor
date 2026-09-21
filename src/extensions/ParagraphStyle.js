import { Extension } from '@tiptap/core';

export const ParagraphStyle = Extension.create({
  name: 'paragraphStyle',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          paragraphStyle: {
            default: null,
            parseHTML: element => {
              const classes = ['fr-text-gray', 'fr-text-bordered', 'fr-text-spaced', 'fr-text-uppercase'];
              for (const cls of classes) {
                if (element.classList.contains(cls)) {
                  return cls;
                }
              }
              return null;
            },
            renderHTML: attributes => {
              if (!attributes.paragraphStyle) {
                return {};
              }
              return {
                class: attributes.paragraphStyle,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setParagraphStyle: (style) => ({ commands }) => {
        return this.options.types.every(type =>
          commands.updateAttributes(type, { paragraphStyle: style })
        );
      },
      unsetParagraphStyle: () => ({ commands }) => {
        return this.options.types.every(type =>
          commands.resetAttributes(type, 'paragraphStyle')
        );
      },
    };
  },
});
