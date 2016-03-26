import PDFJSAnnotate from '../PDFJSAnnotate';

export function createPage(pageNumber) {
  let page = document.createElement('div');
  let canvas = document.createElement('canvas');
  let wrapper = document.createElement('div');
  let annoLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let textLayer = document.createElement('div');

  page.style.visibility = 'hidden';
  page.className = 'page';
  wrapper.className = 'canvasWrapper';
  annoLayer.setAttribute('class', 'annotationLayer');
  textLayer.className = 'textLayer';

  page.setAttribute('id', `pageContainer${pageNumber}`);
  page.setAttribute('data-loaded', 'false');
  page.setAttribute('data-page-number', pageNumber);

  canvas.setAttribute('id', `page${pageNumber}`);

  page.appendChild(wrapper);
  page.appendChild(annoLayer);
  page.appendChild(textLayer);
  wrapper.appendChild(canvas);

  return page;
}

export function renderPage(pageNumber, renderOptions) {
  let {
    documentId,
    pdfDocument,
    scale,
    rotate
  } = renderOptions;

  return Promise.all([
    pdfDocument.getPage(pageNumber),
    PDFJSAnnotate.getAnnotations(documentId, pageNumber)
  ]).then(([pdfPage, annotations]) => {
    let page = document.getElementById(`pageContainer${pageNumber}`);
    let canvas = page.querySelector('canvas');
    let svg = page.querySelector('svg');
    let wrapper = page.querySelector('.canvasWrapper');
    let container = page.querySelector('.textLayer');
    let canvasContext = canvas.getContext('2d');
    let viewport = pdfPage.getViewport(scale, rotate);

    page.style.visibility = '';
    canvas.width = viewport.width * 2;
    canvas.height = viewport.height * 2;
    svg.setAttribute('width', viewport.width);
    svg.setAttribute('height', viewport.height);
    svg.style.width = `${viewport.width}px`;
    svg.style.height = `${viewport.height}px`;
    page.style.width = `${viewport.width}px`;
    page.style.height = `${viewport.height}px`;
    wrapper.style.width = `${viewport.width}px`;
    wrapper.style.height = `${viewport.height}px`;
    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;

    pdfPage.render({
      canvasContext,
      viewport
    });

    PDFJSAnnotate.render(svg, viewport, annotations);

    pdfPage.getTextContent().then(textContent => {
      PDFJSAnnotate.renderTextLayer({
        textContent,
        container,
        viewport,
        textDivs: []
      });
    });

    page.setAttribute('data-loaded', 'true');

    return [pdfPage, annotations];
  });
}
