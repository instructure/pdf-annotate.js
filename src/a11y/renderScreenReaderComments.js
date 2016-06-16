import PDFJSAnnotate from '../PDFJSAnnotate';
import insertScreenReaderComment from './insertScreenReaderComment';

/**
 * Insert the comments into the DOM to be available by screen reader
 *
 * @param {String} documentId The ID of the document
 * @param {String} annotationId the ID of the annotation
 */
export default function renderScreenReaderComments(documentId, annotationId) {
  PDFJSAnnotate.StoreAdapter.getComments(documentId, annotationId).then((comments) => {
    // Node needs to be found by querying DOM as it may have been inserted as innerHTML
    // leaving `screenReaderNode` as an invalid reference (see `insertElementWithinElement`).
    let node = document.getElementById(`pdf-annotate-screenreader-${annotationId}`);
    if (node) { 
      let list = document.createElement('ol');
      list.setAttribute('aria-label', 'Comments');
      node.appendChild(list);
      comments.forEach(insertScreenReaderComment);
    }
  });
}
