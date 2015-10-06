import PDFJSAnnotate from '../../';

let page1 = document.getElementById('page1');
let page2 = document.getElementById('page2');
let annotations;
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');

// Stub in the adapter to pull annotations from localStorage
PDFJSAnnotate.StoreAdapter.getAnnotations = (documentId, pageNumber) => {
  if (!annotations) {
    annotations = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];
  }

  return new Promise((resolve, reject) => {
    resolve(annotations.filter((i) => {
      return i.page === pageNumber;
    }));
  });
};

PDFJSAnnotate.StoreAdapter.addAnnotation = (documentId, pageNumber, annotation) => {
  annotation.page = pageNumber;
  annotations.push(annotation);
  localStorage.setItem(`${documentId}/annotations`, JSON.stringify(annotations));
};

// Get the annotations
Promise.all([
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, 1),
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, 2)
  ]).then(([ann1, ann2]) => {
    PDFJSAnnotate.render(page1, mockViewport(page1), ann1);
    PDFJSAnnotate.render(page2, mockViewport(page2), ann2);
  });

function mockViewport(page) {
  return {
    width: page.offsetWidth,
    height: page.offsetHeight,
    rotation: 0,
    scale: 1
  };
}

// Event handling
(function () {
  function handleButtonClick(type, color) {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let rects = range.getClientRects();
    let parent = selection.anchorNode.parentNode;
   
    while (parent && !parent.getAttribute('data-page')) {
      parent = parent.parentNode;
    }

    PDFJSAnnotate.addAnnotation(DOCUMENT_ID, parseInt(parent.getAttribute('data-page'), 10), {
      type,
      color,
      rectangles: Array.prototype.map.call(rects, (r) => {
        return {
          y: r.top - parent.offsetTop,
          x: r.left - parent.offsetLeft,
          width: r.width,
          height: r.height
        };
      })
    });
  }

  document.querySelector('button.rectangle').addEventListener('click', handleButtonClick.bind(null, 'area', null));
  document.querySelector('button.highlight').addEventListener('click', handleButtonClick.bind(null, 'highlight', 'FFFF00'));
  document.querySelector('button.strikeout').addEventListener('click', handleButtonClick.bind(null, 'strikeout', 'FF0000'));
})();
