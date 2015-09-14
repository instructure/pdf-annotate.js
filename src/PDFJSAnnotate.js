import StoreAdapter from './StoreAdapter';
import AnnotateView from './AnnotateView';

// Public API
let PDFJSAnnotate = {
  StoreAdapter,

  getAnnotations(documentId, pageNumber) {
    return this.StoreAdapter.getAnnotations(documentId, pageNumber);
  },

  render(svg, viewport, annotations) {
    let view = new AnnotateView(svg, viewport, annotations);
    view.render();
  }
};

export default PDFJSAnnotate;
