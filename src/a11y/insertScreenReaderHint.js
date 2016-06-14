import PDFJSAnnotate from '../PDFJSAnnotate';
import insertElementWithinChildren from './insertElementWithinChildren';
import insertElementWithinElement from './insertElementWithinElement';

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
    PDFJSAnnotate.StoreAdapter.getComments(annotation.documentId, annotation.uuid).then((comments) => {
      // Node needs to be found by querying DOM as it may have been inserted as innerHTML
      // leaving `screenReaderNode` as an invalid reference (see `insertElementWithinElement`).
      let node = document.querySelector(`[data-pdf-annotate-srid="${annotation.uuid}"]`);
      if (node) { 
        let list = document.createElement('div');
        list.setAttribute('role', 'list');
        
        comments.forEach((c, i) => {
          let item = document.createElement('div');
          item.setAttribute('role', 'listitem');
          item.appendChild(document.createTextNode(`comment ${i+1}: ${c.content}`));
          list.appendChild(item);
        });

        node.innerHTML += ` (comments ${comments.length})`;
        node.appendChild(list);
      }
    });
  }
}

/**
 * Create a node that is only visible to screen readers
 *
 * @param {String} content The text content that should be read by screen reader
 * @param {String} [annotationId] The ID of the annotation assocaited
 * @return {Element} An Element that is only visible to screen readers
 */
function createScreenReaderOnly(content, annotationId) {
  let node = document.createElement('div');
  let text = document.createTextNode(content);
  node.appendChild(text);
  node.setAttribute('data-pdf-annotate-srid', `${annotationId}`);
  node.style.position = 'absolute';
  node.style.left = '-10000px';
  node.style.top = 'auto';
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.overflow = 'hidden';
  return node;
}
