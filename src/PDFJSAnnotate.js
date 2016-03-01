import StoreAdapter from './StoreAdapter';
import render from './render';
import UI from './UI';

export default {
  StoreAdapter,

  UI,

  render,

  getAnnotations(documentId, pageNumber) {
    return this.StoreAdapter.getAnnotations(...arguments).then((annotations) => {
      return {
        documentId,
        pageNumber,
        annotations
      };
    });
  }
}
