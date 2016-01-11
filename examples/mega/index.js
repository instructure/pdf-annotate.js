import __pdfjs from 'pdfjs-dist/build/pdf.js';
import PDFJSAnnotate from '../../';
import localStoreAdapter from '../localStoreAdapter';
import UI from '../UI';

const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg');
const overlay = document.getElementById('overlay');
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');
const PAGE_NUMBER = 1;
let SCALE = parseFloat(localStorage.getItem(`${DOCUMENT_ID}/scale`), 10) || 1;
let ROTATE = parseInt(localStorage.getItem(`${DOCUMENT_ID}/rotate`), 10) || 0;
const data = {
  page: null,
  annotations: null
};

PDFJSAnnotate.StoreAdapter = localStoreAdapter;
PDFJS.workerSrc = '../pdf.worker.js';

PDFJS.getDocument('PDFJSAnnotate.pdf').then((pdf) => {
  Promise.all([
    pdf.getPage(PAGE_NUMBER),
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, PAGE_NUMBER)
  ])
  .then(([page, annotations]) => {
    data.page = page;
    data.annotations = annotations;
    render();
  });
});

// Render the stuff to the thing
function render() {
  let viewport = data.page.getViewport(SCALE, ROTATE);
  let canvasContext = canvas.getContext('2d');
  let overlayWidth = viewport.width;
  let overlayHeight = viewport.height;
  if (ROTATE % 360 === 90 || ROTATE % 360 === 270) {
    overlayWidth = viewport.height;
    overlayHeight = viewport.width;
  }
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  canvas.style.marginLeft = ((viewport.width / 2) * -1) + 'px';
  
  svg.setAttribute('height', viewport.height);
  svg.setAttribute('width', viewport.width);
  svg.style.marginLeft = ((viewport.width / 2) * -1) + 'px';

  overlay.style.zoom = SCALE;
  overlay.style.transform = `rotate(${ROTATE}deg)`;
  overlay.style.top = (parseInt(getComputedStyle(overlay).top, 10) / SCALE) + 'px';
  overlay.style.height = (overlayHeight / SCALE) + 'px';
  overlay.style.width = (overlayWidth / SCALE) + 'px';
  overlay.style.marginLeft = (((overlayWidth / SCALE) / 2) * -1) + 'px';
  overlay.style.marginTop = (((overlayHeight - viewport.height) / 2) * -1) + 'px';

  data.page.render({canvasContext, viewport});
  PDFJSAnnotate.render(svg, viewport, data.annotations);
}

// Edit stuff
UI.enableEdit();

// Pen stuff
(function () {
  let penSize;
  let penColor;

  function initPen() {
    setPen(
      localStorage.getItem(`${DOCUMENT_ID}/pen/size`) || 1,
      localStorage.getItem(`${DOCUMENT_ID}/pen/color`) || '000000'
    );
  }

  function setPen(size, color) {
    let modified = false;

    if (penSize !== size) {
      modified = true;
      penSize = size;
      localStorage.setItem(`${DOCUMENT_ID}/pen/size`, penSize);
      document.querySelector('.toolbar .pen-size').value = penSize;
      document.querySelector('.toolbar .pen-size-output').innerHTML = `${penSize}px`;
    }

    if (penColor !== color) {
      modified = true;
      penColor = color;
      localStorage.setItem(`${DOCUMENT_ID}/pen/color`, penColor);
      
      let selected = document.querySelector('.toolbar .pen-color-selected');
      if (selected) {
        selected.classList.remove('pen-color-selected');
        selected.removeAttribute('aria-selected');
      }

      selected = document.querySelector(`.toolbar .pen-color[data-color="${color}"]`);
      if (selected) {
        selected.classList.add('pen-color-selected');
        selected.setAttribute('aria-selected', true);
      }
    }

    if (modified) {
      UI.setPen(penSize, penColor);
    }
  }

  function setPenColorFromElement(el) {
    if (el.nodeName === 'A' && el.getAttribute('data-color')) {
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

  document.querySelector('.toolbar').addEventListener('click', handleMenuClick);
  document.querySelector('.toolbar').addEventListener('keyup', handleMenuKeyUp);
  document.querySelector('.pen-size').addEventListener('change', handlePenSizeChange);

  initPen();
})();

// Toolbar buttons
(function () {
  let tooltype = localStorage.getItem(`${DOCUMENT_ID}/tooltype`);
  if (tooltype) {
    setActiveToolbarItem(tooltype, document.querySelector(`.toolbar button[data-tooltype=${tooltype}]`));
  }

  function setActiveToolbarItem(type, button) {
    let active = document.querySelector('.toolbar button.active');
    if (active) {
      active.classList.remove('active');

      switch (type) {
        case 'draw':
          UI.disablePen();
          break;
        case 'area':
        case 'highlight':
        case 'strikeout':
          UI.disableRect();
          break;
      }
    }

    if (button) {
      button.classList.add('active');
    }
    if (tooltype !== type) {
      localStorage.setItem(`${DOCUMENT_ID}/tooltype`, type);
    }
    tooltype = type;

    switch (type) {
      case 'draw':
        UI.enablePen();
        break;
      case 'area':
      case 'highlight':
      case 'strikeout':
        UI.enableRect(type);
        break;
    }
  }

  function handleToolbarClick(e) {
    if (e.target.nodeName === 'BUTTON') {
      setActiveToolbarItem(e.target.getAttribute('data-tooltype'), e.target);
    }
  }

  document.querySelector('.toolbar').addEventListener('click', handleToolbarClick);
})();

// Scale/rotate
(function () {
  function setScaleRotate(scale, rotate) {
    if (SCALE !== scale || ROTATE !== rotate) {
      SCALE = scale;
      ROTATE = rotate;

      localStorage.setItem(`${DOCUMENT_ID}/scale`, SCALE);
      localStorage.setItem(`${DOCUMENT_ID}/rotate`, ROTATE % 360);

      render();
    }
  }

  function handleScaleChange(e) {
    setScaleRotate(e.target.value, ROTATE);
  }

  function handleRotateCWClick() {
    setScaleRotate(SCALE, ROTATE + 90);
  }

  function handleRotateCCWClick() {
    setScaleRotate(SCALE, ROTATE - 90);
  }

  document.querySelector('.toolbar select.scale').value = SCALE;
  document.querySelector('.toolbar select.scale').addEventListener('change', handleScaleChange);
  document.querySelector('.toolbar .rotate-ccw').addEventListener('click', handleRotateCCWClick);
  document.querySelector('.toolbar .rotate-cw').addEventListener('click', handleRotateCWClick);
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
