import PDFJSAnnotate from '../PDFJSAnnotate';
import appendChild from './appendChild';
import renderScreenReaderHints from '../a11y/renderScreenReaderHints';

/**
 * Render the response from PDFJSAnnotate.StoreAdapter.getAnnotations to SVG
 *
 * @param {SVGElement} svg The SVG element to render the annotations to
 * @param {Object} viewport The page viewport data
 * @param {Object} data The response from PDFJSAnnotate.StoreAdapter.getAnnotations
 * @return {SVGElement} The SVG element that was rendered to
 */
export default function render(svg, viewport, data) {
  // Reset the content of the SVG
  svg.innerHTML = ''; 
  svg.setAttribute('data-pdf-annotate-container', true);
  svg.setAttribute('data-pdf-annotate-viewport', JSON.stringify(viewport));
  svg.removeAttribute('data-pdf-annotate-document');
  svg.removeAttribute('data-pdf-annotate-page');

  // If there's no data nothing can be done
  if (!data) {
    return svg;
  }

  svg.setAttribute('data-pdf-annotate-document', data.documentId);
  svg.setAttribute('data-pdf-annotate-page', data.pageNumber);
  
  // Make sure annotations is an array
  if (!Array.isArray(data.annotations) || data.annotations.length === 0) {
    return svg;
  }

  // Append annotation to svg
  data.annotations.forEach((a) => {
    appendChild(svg, a, viewport);
  });

  // Enable a11y
  // TODO this should def not use timeout, but is needed to wait for PDFJSText.render
  setTimeout(function () {
    renderScreenReaderHints(data.annotations);
  }, 5000);

  return svg;
}
