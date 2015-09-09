import StoreAdapter from './StoreAdapter';
import AnnotateView from './AnnotateView';

// Public API
let PDFJSAnnotate = {
  StoreAdapter,

  getAnnotations(documentId, pageNumber) {
    return this.StoreAdapter.getAnnotations(documentId, pageNumber);
  },

  render(viewport, annotations) {
    let view = new AnnotateView(viewport, annotations);
    view.render();
  }
};

export default PDFJSAnnotate;
