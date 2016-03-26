import StoreAdapter from './StoreAdapter';
import render from './render';
import UI from './UI';
import mergeAdjacentText from './utils/mergeAdjacentText';

export default {
  StoreAdapter,

  UI,

  render,

  renderTextLayer(options) {
    let textLayerFactory = new PDFJS.DefaultTextLayerFactory();
    let textLayerBuilder = textLayerFactory.createTextLayerBuilder(options.container, options.pageNumber - 1, options.viewport);
    textLayerBuilder.setTextContent(options.textContent);
    textLayerBuilder.render();

    setTimeout(function () {
      mergeAdjacentText(options.container);
    });
  },

  getAnnotations(documentId, pageNumber) {
    return this.StoreAdapter.getAnnotations(...arguments);
  }
}
