import StoreAdapter from './StoreAdapter';
import renderView from './render/renderView';

// Public API
let PDFJSAnnotate = {
  StoreAdapter,

  getAnnotations(documentId, pageNumber) {
    return this.StoreAdapter.getAnnotations(...arguments).then((annotations) => {
      return {
        documentId,
        pageNumber,
        annotations
      };
    });
  },

  getAnnotation(documentId, annotationId) {
    return this.StoreAdapter.getAnnotation(...arguments);
  },

  addAnnotation(documentId, pageNumber, annotation) {
    return this.StoreAdapter.addAnnotation(...arguments);
  },

  editAnnotation(documentId, pageNumber, annotation) {
    return this.StoreAdapter.editAnnotation(...arguments);
  },

  deleteAnnotation(documentId, annotationId) {
    return this.StoreAdapter.deleteAnnotation(...arguments);
  },

  getComments(documentId, annotationId) {
    return this.StoreAdapter.getComments(...arguments);
  },

  addComment(documentId, annotationId, content) {
    return this.StoreAdapter.addComment(...arguments);
  },

  deleteComment(documentId, commentId) {
    return this.StoreAdapter.deleteComment(...arguments);
  },

  render(svg, viewport, annotations) {
    return renderView(...arguments);
  }
};

export default PDFJSAnnotate;
