import __pdfjs from 'pdfjs-dist/build/pdf.js';
import PDFJSAnnotate from '../../';
import localStoreAdapter from '../localStoreAdapter';
import UI from '../UI';

const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg');
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');
const PAGE_NUMBER = 1;
const data = {
  page: null,
  annotations: null
};

PDFJSAnnotate.StoreAdapter = localStoreAdapter;
PDFJS.workerSrc = '../pdf.worker.js';

PDFJS.getDocument('PDFJSAnnotate.pdf').then((pdf) => {
  Promise.all([
    pdf.getPage(1),
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, 1)
  ])
  .then(([page, annotations]) => {
    data.page = page;
    data.annotations = annotations;
    render();
  });
});

// Render the stuff to the thing
function render() {
  let viewport = data.page.getViewport(1.33, 0);
  let canvasContext = canvas.getContext('2d');
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  canvas.style.marginLeft = ((viewport.width / 2) * -1) + 'px';
  
  svg.setAttribute('height', viewport.height);
  svg.setAttribute('width', viewport.width);
  svg.style.marginLeft = ((viewport.width / 2) * -1) + 'px';

  data.page.render({canvasContext, viewport});
  PDFJSAnnotate.render(svg, viewport, data.annotations);
}

// Pen stuff
(function () {
  let penSize;
  let penColor;

  function initPen() {
    penColor = localStorage.getItem(`${DOCUMENT_ID}/pen/color`) || '000000';
    penSize = localStorage.getItem(`${DOCUMENT_ID}/pen/size`) || 1;
    
    Array.prototype.forEach.call(document.querySelectorAll('.pen-color'), (i) => {
      if (i.getAttribute('data-color') === penColor) {
        selectPenColor(i);
      }
    });
    document.querySelector('.pen-size').value = penSize;
    document.querySelector('.pen-size-output').innerHTML = penSize;
  
    UI.initPen(penSize, penColor, (width, color, lines) => {
      PDFJSAnnotate.addAnnotation(DOCUMENT_ID, PAGE_NUMBER, {
        type: 'drawing',
        width,
        color,
        lines
      });
    });
  }

  function setPenColorFromEvent(e) {
    if (e.target.nodeName === 'A' && e.target.getAttribute('data-color')) {
      penColor = e.target.getAttribute('data-color');
      localStorage.setItem(`${DOCUMENT_ID}/pen/color`, penColor);
      selectPenColor(e.target);
      UI.setPen(penSize, penColor);
    }
  }

  function selectPenColor(el) {
    let old = document.querySelector('.pen-color-selected');

    if (old) {
      old.classList.remove('pen-color-selected');
      old.removeAttribute('aria-selected');
    }

    el.classList.add('pen-color-selected');
    el.setAttribute('aria-selected', true);
  }

  function handleMenuClick(e) {
    setPenColorFromEvent(e);
  }

  function handleMenuKeyUp(e) {
    if (e.keyCode === 32) {
      setPenColorFromEvent(e);
    }
  }

  function handlePenSizeChange(e) {
    penSize = e.target.value;
    localStorage.setItem(`${DOCUMENT_ID}/pen/size`, penSize);
    document.querySelector('.pen-size-output').innerHTML = penSize;
    UI.setPen(penSize, penColor);
  }

  document.querySelector('.toolbar').addEventListener('click', handleMenuClick);
  document.querySelector('.toolbar').addEventListener('keyup', handleMenuKeyUp);
  document.querySelector('.pen-size').addEventListener('change', handlePenSizeChange);

  initPen();
})();

// Toolbar buttons
(function () {
  let tooltype;

  function handleToolbarClick(e) {
    if (e.target.nodeName === 'BUTTON') {
      let active = document.querySelector('.toolbar button.active');
      if (active) {
        active.classList.remove('active');
        if (tooltype === 'draw') {
          UI.disablePen();
        }
      }

      e.target.classList.add('active');
      tooltype = e.target.getAttribute('data-tooltype');

      if (tooltype === 'draw') {
        UI.enablePen();
      }
    }
  }

  document.querySelector('.toolbar').addEventListener('click', handleToolbarClick);
})();

// Clear toolbar button
(function () {
  function handleClearClick(e) {
    if (confirm('Are you sure you want to clear annotations?')) {
      localStorage.removeItem(`${DOCUMENT_ID}/annotations`);
      svg.innerHTML = '';
    }
  }
  document.querySelector('a.clear').addEventListener('click', handleClearClick);
})();
