import PDFJSAnnotate from '../../';
import localStoreAdapter from '../localStoreAdapter';
import mockViewport from '../mockViewport';

const { UI } = PDFJSAnnotate;
const svg = document.getElementById('svg');
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');
const PAGE_NUMBER = 1;
let annotations;

PDFJSAnnotate.StoreAdapter = localStoreAdapter;

// Get the annotations
PDFJSAnnotate.getAnnotations(DOCUMENT_ID, PAGE_NUMBER).then((annotations) => {
  PDFJSAnnotate.render(svg, mockViewport(svg), annotations);
});

// Pen stuff
(function () {
  let penColor;
  let penSize;

  function initPen() {
    let size = document.querySelector('.toolbar .pen-size');
    for (let i=0; i<20; i++) {
      size.appendChild(new Option(i+1, i+1));
    }

    setPen(
      localStorage.getItem(`${DOCUMENT_ID}/pen/size`) || 1,
      localStorage.getItem(`${DOCUMENT_ID}/pen/color`) || '000000'
    );

    UI.enablePen();
  }

  function setPen(size, color) {
    let modified = false;

    if (penSize !== size) {
      modified = true;
      penSize = size;
      localStorage.setItem(`${DOCUMENT_ID}/pen/size`, penSize);
      document.querySelector('.toolbar .pen-size').value = penSize;
    }

    if (penColor !== color) {
      modified = true;
      penColor = color;
      localStorage.setItem(`${DOCUMENT_ID}/pen/color`, penColor);
      
      let selected = document.querySelector('.toolbar .pen-color.color-selected');
      if (selected) {
        selected.classList.remove('color-selected');
        selected.removeAttribute('aria-selected');
      }

      selected = document.querySelector(`.toolbar .pen-color[data-color="${color}"]`);
      if (selected) {
        selected.classList.add('color-selected');
        selected.setAttribute('aria-selected', true);
      }
    }

    if (modified) {
      UI.setPen(penSize, penColor);
    }
  }

  function setPenColorFromElement(el) {
    if (el.nodeName === 'A' &&
        el.classList.contains('pen-color') &&
        el.getAttribute('data-color')) {
      setPen(penSize, el.getAttribute('data-color'));
    }
  }

  function handleMenuClick(e) {
    setPenColorFromElement(e.target);
  }

  function handleMenuKeyUp(e) {
    if (e.keyCode === 32) {
      setPenColorFromElement(e.target);
    }
  }

  function handlePenSizeChange(e) {
    setPen(e.target.value, penColor);
  }

  function handleClearClick(e) {
    if (confirm('Are you sure you want to throw your art away?')) {
      localStorage.removeItem(`${DOCUMENT_ID}/annotations`);
      svg.innerHTML = '';
    }
  }

  document.querySelector('.toolbar').addEventListener('click', handleMenuClick);
  document.querySelector('.toolbar').addEventListener('keyup', handleMenuKeyUp);
  document.querySelector('.pen-size').addEventListener('change', handlePenSizeChange);
  document.querySelector('.toolbar .clear').addEventListener('click', handleClearClick);

  initPen();
})();
