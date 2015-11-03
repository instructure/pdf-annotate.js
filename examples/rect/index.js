import PDFJSAnnotate from '../../';
import arrayFrom from '../../src/utils/arrayFrom';
import renderRect from '../../src/render/renderRect';
import renderLine from '../../src/render/renderLine';
import localStoreAdapter from '../localStoreAdapter';
import mockViewport from '../mockViewport';

let page1 = document.getElementById('page1');
let page2 = document.getElementById('page2');
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');

PDFJSAnnotate.StoreAdapter = localStoreAdapter;

// Get the annotations
Promise.all([
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, 1),
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, 2)
  ]).then(([ann1, ann2]) => {
    PDFJSAnnotate.render(page1, mockViewport(page1), ann1);
    PDFJSAnnotate.render(page2, mockViewport(page2), ann2);
  });

// Event handling
(function () {
  function handleButtonClick(type, color) {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let rects = range.getClientRects();
    let parent = selection.anchorNode.parentNode;
    let node;
    let svg;
    let annotation;

    // Find the parent that contains page info
    while (parent && !parent.getAttribute('data-page')) {
      parent = parent.parentNode;
    }

    // Initialize the annotation
    annotation = {
      type,
      color,
      rectangles: Array.prototype.map.call(rects, (r) => {
        let offset = 0;

        if (type === 'strikeout') {
          offset = r.height / 2;
        }

        return {
          y: (r.top + offset) - parent.offsetTop,
          x: r.left - parent.offsetLeft,
          width: r.width,
          height: r.height
        };
      })
    };

    // Add the annotation
    PDFJSAnnotate.addAnnotation(DOCUMENT_ID, parseInt(parent.getAttribute('data-page'), 10), annotation);

    // Render the annotation
    if (type === 'strikeout') {
      node = renderLine(annotation);
    } else {
      node = renderRect(annotation);
    }

    svg = parent.querySelector('svg');

    arrayFrom(node).forEach((el) => {
      svg.appendChild(el);
    });
  }

  function handleClearClick() {
    localStorage.removeItem(`${DOCUMENT_ID}/annotations`);
    page1.innerHTML = '';
    page2.innerHTML = '';
  }

  document.querySelector('button.rectangle').addEventListener('click', handleButtonClick.bind(null, 'area', null));
  document.querySelector('button.highlight').addEventListener('click', handleButtonClick.bind(null, 'highlight', 'FFFF00'));
  document.querySelector('button.strikeout').addEventListener('click', handleButtonClick.bind(null, 'strikeout', 'FF0000'));
  document.querySelector('button.clear').addEventListener('click', handleClearClick);
})();
