import PDFJSAnnotate from '../PDFJSAnnotate';
import insertElementWithinChildren from './insertElementWithinChildren';
import insertElementWithinElement from './insertElementWithinElement';
import {
  findSVGAtPoint,
  getMetadata
} from '../UI/utils';

/**
 * Insert a hint into the DOM for screen readers for a specific annotation.
 *
 * @param {Object} annotation The annotation to insert a hint for
 * @param {Number} num The number of the annotation out of all annotations of the same type
 */
export default function insertScreenReaderHint(annotation, num) {
  if (annotation.type === 'highlight' || annotation.type === 'strikeout') {
    let rects = annotation.rectangles;
    let first = rects[0];
    let last = rects[rects.length - 1];

    insertElementWithinElement(
      createScreenReaderOnly(`Begin ${annotation.type} annotation ${num}`),
      first.x, first.y, annotation.page, true
    );

    insertElementWithinElement(
      createScreenReaderOnly(`End ${annotation.type} annotation ${num}`),
      last.x + last.width, last.y, annotation.page, false
    );
  } else if (annotation.type === 'textbox' || annotation.type === 'point') {
    let svg = findSVGAtPoint(annotation.x, annotation.y);
    let { documentId } = getMetadata(svg);

    // Include comments in screen reader hint
    PDFJSAnnotate.StoreAdapter.getComments(documentId, annotation.uuid).then((comments) => {
      let text = annotation.type === 'textbox' ? ` (content: ${annotation.content})` : '';
      insertElementWithinChildren(
        createScreenReaderOnly(`${annotation.type} annotation ${num}${text} (comments ${comments.length})`),
        annotation.x, annotation.y, annotation.page
      );
    });
  }
}

/**
 * Create a node that is only visible to screen readers
 *
 * @param {String} content The text content that should be read by screen reader
 * @return {Element} An Element that is only visible to screen readers
 */
function createScreenReaderOnly(content) {
  let node = document.createElement('div');
  let text = document.createTextNode(content);
  node.appendChild(text);
  node.style.position = 'absolute';
  node.style.left = '-10000px';
  node.style.top = 'auto';
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.overflow = 'hidden';
  return node;
}
