import PDFJSText from 'pdf-text.js';
import PDFJSAnnotate from '../PDFJSAnnotate';
import renderScreenReaderHints from '../a11y/renderScreenReaderHints';

/**
 * Create a new page to be appended to the DOM.
 *
 * @param {Number} pageNumber The page number that is being created
 * @return {HTMLElement}
 */
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

  canvas.mozOpaque = true;
  canvas.setAttribute('id', `page${pageNumber}`);

  page.appendChild(wrapper);
  page.appendChild(annoLayer);
  page.appendChild(textLayer);
  wrapper.appendChild(canvas);

  return page;
}

/**
 * Render a page.
 *
 * @param {String} pageNumber The page number to be rendered
 * @param {Object} renderOptions The options for rendering
 * @return {Promise}
 */
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
    let canvasContext = canvas.getContext('2d', {alpha: false});
    let outputScale = getOutputScale(canvasContext);
    let viewport = pdfPage.getViewport(scale, rotate);
    let transform = !outputScale.scaled ? null : [outputScale.sx, 0, 0, outputScale.sy, 0, 0];
    let sfx = approximateFraction(outputScale.sx);
    let sfy = approximateFraction(outputScale.sy);

    page.style.visibility = '';
    canvas.width = roundToDivide(viewport.width * outputScale.sx, sfx[0]);
    canvas.height = roundToDivide(viewport.height * outputScale.sy, sfy[0]);
    canvas.style.width = roundToDivide(viewport.width, sfx[1]) + 'px';
    canvas.style.height = roundToDivide(viewport.height, sfx[1]) + 'px';
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
      viewport,
      transform
    });

    PDFJSAnnotate.render(svg, viewport, annotations);

    pdfPage.getTextContent({normalizeWhitespace: true}).then(textContent => {
      // Render text layer
      PDFJSText.render({
        textContent,
        container,
        viewport,
        textDivs: []
      }).then(() => {
        // Enable a11y
        renderScreenReaderHints(annotations.annotations);
      });
    });

    page.setAttribute('data-loaded', 'true');

    return [pdfPage, annotations];
  });
}


/**
 * Approximates a float number as a fraction using Farey sequence (max order of 8).
 *
 * @param {Number} x Positive float number
 * @return {Array} Estimated fraction: the first array item is a numerator,
 *                 the second one is a denominator.
 */
function approximateFraction(x) {
  // Fast path for int numbers or their inversions.
  if (Math.floor(x) === x) {
    return [x, 1];
  }

  const xinv = 1 / x;
  const limit = 8;
  if (xinv > limit) {
    return [1, limit];
  } else if (Math.floor(xinv) === xinv) {
    return [1, xinv];
  }

  const x_ = x > 1 ? xinv : x;
  
  // a/b and c/d are neighbours in Farey sequence.
  let a = 0, b = 1, c = 1, d = 1;
  
  // Limit search to order 8.
  while (true) {
    // Generating next term in sequence (order of q).
    let p = a + c, q = b + d;
    if (q > limit) {
      break;
    }
    if (x_ <= p / q) {
      c = p; d = q;
    } else {
      a = p; b = q;
    }
  }

  // Select closest of neighbours to x.
  if (x_ - a / b < c / d - x_) {
    return x_ === x ? [a, b] : [b, a];
  } else {
    return x_ === x ? [c, d] : [d, c];
  }
}

function getOutputScale(ctx) {
  let devicePixelRatio = window.devicePixelRatio || 1;
  let backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                          ctx.mozBackingStorePixelRatio ||
                          ctx.msBackingStorePixelRatio ||
                          ctx.oBackingStorePixelRatio ||
                          ctx.backingStorePixelRatio || 1;
  let pixelRatio = devicePixelRatio / backingStoreRatio;
  return {
    sx: pixelRatio,
    sy: pixelRatio,
    scaled: pixelRatio !== 1
  };
}

function roundToDivide(x, div) {
  let r = x % div;
  return r === 0 ? x : Math.round(x - r + div);
}
