import __pdfjs from 'pdfjs-dist/build/pdf.js';
import PDFJSAnnotate from '../';
import annotations from './annotations';

PDFJS.workerSrc = '../node_modules/pdfjs-dist/build/pdf.worker.js';

PDFJSAnnotate.StoreAdapter.getAnnotations = (documentId, pageNumber) => {
  return new Promise((resolve, reject) => {
    resolve(annotations);
  });
};

PDFJS.getDocument('PDFJSAnnotate.pdf').then((pdf) => {
  Promise.all([
    pdf.getPage(1),
    PDFJSAnnotate.getAnnotations(1)
  ])
  .then(([page, annotations]) => {
    let scale = 1;
    let viewport = page.getViewport(scale);
    let canvas = document.getElementById('canvas');
    let svg = document.getElementById('svg');
    let canvasContext = canvas.getContext('2d');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    svg.style.height = viewport.height + 'px';
    svg.style.width = viewport.width + 'px';

    page.render({canvasContext, viewport});
    PDFJSAnnotate.render(svg, viewport, annotations);
  });
});
