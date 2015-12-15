import __pdfjs from 'pdfjs-dist/build/pdf.js';
import PDFJSAnnotate from '../../';
import localStoreAdapter from '../localStoreAdapter';

const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');
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

function render() {
  let viewport = data.page.getViewport(1.33, 0);
  let canvas = document.getElementById('canvas');
  let svg = document.getElementById('svg');
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
