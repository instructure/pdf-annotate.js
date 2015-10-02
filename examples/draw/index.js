import PDFJSAnnotate from '../../';
import renderPath from '../../src/render/renderPath';

let path;
let lines;
let annotations;
let penColor;
let penSize;
let svg = document.getElementById('svg');
const STORAGE_KEY = 'draw/annotations';

// Stub in the adapter to pull annotations from localStorage
PDFJSAnnotate.StoreAdapter.getAnnotations = (documentId, pageNumber) => {
  return new Promise((resolve, reject) => {
    annotations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    resolve(annotations);
  });
};

// Get the annotations
PDFJSAnnotate.getAnnotations().then((annotations) => {
  let viewport = {
    width: svg.offsetWidth,
    height: svg.offsetHeight,
    rotation: 0,
    scale: 1
  };
  PDFJSAnnotate.render(svg, viewport, annotations);
});

// Event handling
(function () {
  function handleMouseDown() {
    path = null;
    lines = [];

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseUp() {
    if (lines.length > 0) {
      annotations.push({
        type: 'drawing',
        color: penColor,
        width: penSize,
        lines
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e) {
    lines.push([e.clientX, e.clientY]);

    if (lines.length <= 1) {
      return;
    }

    if (path) {
      svg.removeChild(path);
    }

    path = renderPath({
      color: penColor,
      width: penSize,
      lines
    });

    svg.appendChild(path);
  }

  function handleSelectStart(e) {
    e.preventDefault();
    return false;
  }

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('selectstart', handleSelectStart);
})();

// Pen stuff
(function () {
  function initPen() {
    penColor = localStorage.getItem('draw/pen/color') || '000000';
    penSize = localStorage.getItem('draw/pen/size') || 1;
    
    Array.prototype.forEach.call(document.querySelectorAll('.pen-color'), (i) => {
      if (i.getAttribute('data-color') === penColor) {
        i.classList.add('pen-color-selected');
      }
    });
    document.querySelector('.pen-size').value = penSize;
  }

  function handleMenuClick(e) {
    if (e.target.nodeName === 'A' && e.target.getAttribute('data-color')) {
      penColor = e.target.getAttribute('data-color');
      localStorage.setItem('draw/pen/color', penColor);
      document.querySelector('.pen-color-selected').classList.remove('pen-color-selected');
      e.target.classList.add('pen-color-selected');
    }
  }

  function handlePenSizeChange(e) {
    penSize = e.target.value;
    localStorage.setItem('draw/pen/size', penSize);
  }

  function handleClearClick(e) {
    if (confirm('Are you sure you want to throw your art away?')) {
      localStorage.removeItem(STORAGE_KEY);
      svg.innerHTML = '';
    }
  }

  document.querySelector('.menu').addEventListener('click', handleMenuClick);
  document.querySelector('.pen-size').addEventListener('change', handlePenSizeChange);
  document.querySelector('.drawing-clear').addEventListener('click', handleClearClick);

  initPen();
})();
