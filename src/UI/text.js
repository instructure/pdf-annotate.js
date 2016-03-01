import PDFJSAnnotate from '../PDFJSAnnotate';
import appendChild from '../render/appendChild';
import {
  BORDER_COLOR,
  findSVGAtPoint,
  getMetadata,
  scaleDown
} from './utils';

let _enabled = false;
let input;
let _textSize;
let _textColor;

function handleMouseUp(e) {
  if (input) {
    return;
  }

  if (!findSVGAtPoint(e.clientX, e.clientY)) {
    return;
  }

  input = document.createElement('input');
  input.style.border = `3px solid ${BORDER_COLOR}`;
  input.style.borderRadius = '3px';
  input.style.position = 'absolute';
  input.style.top = `${e.clientY}px`;
  input.style.left = `${e.clientX}px`;
  input.style.fontSize = `${_textSize}px`;

  input.addEventListener('blur', handleBlur);
  input.addEventListener('keyup', handleKeyUp);

  document.body.appendChild(input);
  input.focus();
}

function handleBlur(e) {
  saveText();
}

function handleKeyUp(e) {
  if (e.keyCode === 27) {
    closeInput();
  } else if (e.keyCode === 13) {
    saveText();
  }
}

function saveText() {
  if (input.value.trim().length > 0) {
    let clientX = parseInt(input.style.left, 10);
    let clientY = parseInt(input.style.top, 10);
    let svg = findSVGAtPoint(clientX, clientY);
    if (!svg) {
      return;
    }

    let { documentId, pageNumber } = getMetadata(svg);
    let rect = svg.getBoundingClientRect();
    let annotation = Object.assign({
        type: 'textbox',
        size: _textSize,
        color: _textColor,
        content: input.value.trim()
      }, scaleDown(svg, {
        x: clientX - rect.left,
        y: clientY -  rect.top,
        width: input.offsetWidth,
        height: input.offsetHeight
      })
    );

    PDFJSAnnotate.StoreAdapter.addAnnotation(documentId, pageNumber, annotation)
      .then((annotation) => {
        appendChild(svg, annotation);
      });
  }
  
  closeInput();
}

function closeInput() {
  if (input) {
    input.removeEventListener('blur', handleBlur);
    input.removeEventListener('keyup', handleKeyUp);
    document.body.removeChild(input);
    input = null;
  }
}

export function setText(textSize = 12, textColor = '000') {
  _textSize = parseInt(textSize, 10);
  _textColor = textColor;
}

export function enableText() {
  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener('mouseup', handleMouseUp);
}

export function disableText() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener('mouseup', handleMouseUp);
}

