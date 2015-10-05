import PDFJSAnnotate from '../../';
import renderPath from '../../src/render/renderPath';

let path;
let lines;
let annotations;
let penColor;
let penSize;
let svg = document.getElementById('svg');
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');
const PAGE_NUMBER = 1;

// Stub in the adapter to pull annotations from localStorage
PDFJSAnnotate.StoreAdapter.getAnnotations = (documentId, pageNumber) => {
  return new Promise((resolve, reject) => {
    annotations = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];
    resolve(annotations);
  });
};

PDFJSAnnotate.StoreAdapter.addAnnotation = (documentId, pageNumber, annotation) => {
  annotation.page = pageNumber;
  annotations.push(annotation);
  localStorage.setItem(`${documentId}/annotations`, JSON.stringify(annotations));
};

// Get the annotations
PDFJSAnnotate.getAnnotations(DOCUMENT_ID, PAGE_NUMBER).then((annotations) => {
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
    if (lines.length > 1) {
      PDFJSAnnotate.addAnnotation(DOCUMENT_ID, PAGE_NUMBER, {
        type: 'drawing',
        color: penColor,
        width: penSize,
        lines
      });
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
    penColor = localStorage.getItem(`${DOCUMENT_ID}/pen/color`) || '000000';
    penSize = localStorage.getItem(`${DOCUMENT_ID}/pen/size`) || 1;
    
    Array.prototype.forEach.call(document.querySelectorAll('.pen-color'), (i) => {
      if (i.getAttribute('data-color') === penColor) {
        selectPenColor(i);
      }
    });
    document.querySelector('.pen-size').value = penSize;
    document.querySelector('.pen-size-output').innerHTML = penSize;
  }

  function setPenColorFromEvent(e) {
    if (e.target.nodeName === 'A' && e.target.getAttribute('data-color')) {
      penColor = e.target.getAttribute('data-color');
      localStorage.setItem(`${DOCUMENT_ID}/pen/color`, penColor);
      selectPenColor(e.target);
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
  }

  function handleClearClick(e) {
    if (confirm('Are you sure you want to throw your art away?')) {
      localStorage.removeItem(`${DOCUMENT_ID}/annotations`);
      svg.innerHTML = '';
    }
  }

  document.querySelector('.menu').addEventListener('click', handleMenuClick);
  document.querySelector('.menu').addEventListener('keyup', handleMenuKeyUp);
  document.querySelector('.pen-size').addEventListener('change', handlePenSizeChange);
  document.querySelector('.drawing-clear').addEventListener('click', handleClearClick);

  initPen();
})();
