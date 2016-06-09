import PDFJSAnnotate from '../PDFJSAnnotate';
import insertElementWithinChildren from './insertElementWithinChildren';
import insertElementWithinElement from './insertElementWithinElement';

/**
 * Insert a hint into the DOM for screen readers for a specific annotation.
 *
 * @param {Object} annotation The annotation to insert a hint for
 * @param {Number} num The number of the annotation out of all annotations of the same type
 */
export default function insertScreenReaderHint(annotation, num) {
  let screenReaderNode;

  if (annotation.type === 'highlight' || annotation.type === 'strikeout') {
    let rects = annotation.rectangles;
    let first = rects[0];
    let last = rects[rects.length - 1];
    screenReaderNode = createScreenReaderOnly(`Begin ${annotation.type} annotation ${num}`);

    insertElementWithinElement(
      screenReaderNode,
      first.x, first.y, annotation.page, true
    );

    insertElementWithinElement(
      createScreenReaderOnly(`End ${annotation.type} annotation ${num}`),
      last.x + last.width, last.y, annotation.page, false
    );
  } else if (annotation.type === 'textbox' || annotation.type === 'point') {
    let text = annotation.type === 'textbox' ? ` (content: ${annotation.content})` : '';
    screenReaderNode = createScreenReaderOnly(`${annotation.type} annotation ${num}${text}`);

    insertElementWithinChildren(
      screenReaderNode,
      annotation.x, annotation.y, annotation.page
    );
  }

  // Include comments in screen reader hint
  if (annotation.type === 'highlight' || annotation.type === 'point') {
    PDFJSAnnotate.StoreAdapter.getComments(annotation.documentId, annotation.uuid).then((comments) => {
      // Node needs to be found by querying DOM as it may have been inserted as innerHTML
      // leaving `screenReaderNode` as an invalid reference (see `insertElementWithinElement`).
      let srid = screenReaderNode.getAttribute('data-pdf-annotate-srid');
      let node = document.querySelector(`[data-pdf-annotate-srid="${srid}"]`);
      if (node) {
        node.innerHTML += ` (comments ${comments.length})`;
      }
    });
  }
}

/**
 * Create a node that is only visible to screen readers
 *
 * @param {String} content The text content that should be read by screen reader
 * @return {Element} An Element that is only visible to screen readers
 */
let sridCounter = 0;
function createScreenReaderOnly(content) {
  let node = document.createElement('div');
  let text = document.createTextNode(content);
  node.appendChild(text);
  node.setAttribute('data-pdf-annotate-srid', `${sridCounter++}`);
  node.style.position = 'absolute';
  node.style.left = '-10000px';
  node.style.top = 'auto';
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.overflow = 'hidden';
  return node;
}
