import FroalaEditor from 'froala-editor';
import { convertLatexToMarkup } from 'mathlive';
import 'mathlive';
import 'mathlive/fonts.css';
import 'mathlive/static.css';
import './froalaMathLivePlugin.css';

const COMMAND_NAME = 'insertMathEquation';

FroalaEditor.DefineIcon(COMMAND_NAME, { NAME: '∑', template: 'text' });

FroalaEditor.RegisterCommand(COMMAND_NAME, {
  title: 'Insert math equation',
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  callback() {
    openMathLiveModal(this);
  },
});

function openMathLiveModal(editor) {
  editor.selection.save();

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
    editor.selection.restore();
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
      editor.selection.restore();
      return;
    }

    const markup = convertLatexToMarkup(latex);
    editor.selection.restore();
    editor.html.insert(
      `<span class="fr-mathlive-formula" contenteditable="false" data-latex="${latex.replace(/"/g, '&quot;')}">${markup}</span>&nbsp;`,
    );
    editor.events.trigger('contentChanged');
  });
}
