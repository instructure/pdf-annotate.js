import createScreenReaderOnly from './createScreenReaderOnly';
import insertElementWithinChildren from './insertElementWithinChildren';
import insertElementWithinElement from './insertElementWithinElement';
import renderScreenReaderComments from './renderScreenReaderComments';

// Annotation types that support comments
const COMMENT_TYPES = ['highlight', 'point', 'area'];

/**
 * Insert a hint into the DOM for screen readers for a specific annotation.
 *
 * @param {Object} annotation The annotation to insert a hint for
 * @param {Number} num The number of the annotation out of all annotations of the same type
 */
export default function insertScreenReaderHint(annotation, num) {
  let screenReaderNode;

  switch (annotation.type) {
    case 'highlight':
    case 'strikeout':
      let rects = annotation.rectangles;
      let first = rects[0];
      let last = rects[rects.length - 1];
      screenReaderNode = createScreenReaderOnly(`Begin ${annotation.type} annotation ${num}`, annotation.uuid);

      insertElementWithinElement(
        screenReaderNode,
        first.x, first.y, annotation.page, true
      );

      insertElementWithinElement(
        createScreenReaderOnly(`End ${annotation.type} annotation ${num}`),
        last.x + last.width, last.y, annotation.page, false
      );
      break;

    case 'textbox':
    case 'point':
      let text = annotation.type === 'textbox' ? ` (content: ${annotation.content})` : '';
      screenReaderNode = createScreenReaderOnly(`${annotation.type} annotation ${num}${text}`, annotation.uuid);

      insertElementWithinChildren(
        screenReaderNode,
        annotation.x, annotation.y, annotation.page
      );
      break;

    case 'drawing':
    case 'area':
      screenReaderNode = createScreenReaderOnly(`Unlabeled drawing`, annotation.uuid);

      let x = typeof annotation.x !== 'undefined' ? annotation.x : annotation.lines[0][0];
      let y = typeof annotation.y !== 'undefined' ? annotation.y : annotation.lines[0][1];

      insertElementWithinChildren(screenReaderNode, x, y, annotation.page);
      break;
  }

  // Include comments in screen reader hint
  if (COMMENT_TYPES.includes(annotation.type)) {
    renderScreenReaderComments(annotation.documentId, annotation.uuid);
  }
}
