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

function handleMouseUp(e) {
  if (input) {
    return;
  }

  if (!findSVGAtPoint(e.clientX, e.clientY)) {
    return;
  }

  input = document.createElement('input');
  input.setAttribute('placeholder', 'Enter comment');
  input.style.border = `3px solid ${BORDER_COLOR}`;
  input.style.borderRadius = '3px';
  input.style.position = 'absolute';
  input.style.top = `${e.clientY}px`;
  input.style.left = `${e.clientX}px`;

  input.addEventListener('blur', handleBlur);
  input.addEventListener('keyup', handleKeyUp);

  document.body.appendChild(input);
  input.focus();
}

function handleBlur(e) {
  savePoint();
}

function handleKeyUp(e) {
  if (e.keyCode === 27) {
    closeInput();
  } else if (e.keyCode === 13) {
    savePoint();
  }
}

function savePoint() {
  if (input.value.trim().length > 0) {
    let clientX = parseInt(input.style.left, 10);
    let clientY = parseInt(input.style.top, 10);
    let content = input.value.trim();
    let svg = findSVGAtPoint(clientX, clientY);
    if (!svg) {
      return;
    }

    let rect = svg.getBoundingClientRect();
    let { documentId, pageNumber } = getMetadata(svg);
    let annotation = Object.assign({
        type: 'point'
      }, scaleDown(svg, {
        x: clientX - rect.left,
        y: clientY - rect.top
      })
    );

    PDFJSAnnotate.StoreAdapter.addAnnotation(documentId, pageNumber, annotation)
      .then((annotation) => {
        PDFJSAnnotate.StoreAdapter.addComment(
          documentId,
          annotation.uuid,
          content
        );

        appendChild(svg, annotation);
      });
  }

  closeInput();
}

function closeInput() {
  input.removeEventListener('blur', handleBlur);
  input.removeEventListener('keyup', handleKeyUp);
  document.body.removeChild(input);
  input = null;
}

export function enablePoint() {
  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener('mouseup', handleMouseUp);
}

export function disablePoint() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener('mouseup', handleMouseUp);
}

